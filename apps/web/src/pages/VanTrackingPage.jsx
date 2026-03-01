import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { MapPin, Navigation, RefreshCw, Clock, Phone, Truck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const LAKE_CITY_EMBED = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13598.7!2d74.3048!3d31.5546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391904359a1bf6b5%3A0xa22a85a74a23e257!2sLake+City%2C+Lahore!5e0!3m2!1sen!2spk!4v1234567890123!5m2!1sen!2spk`;

const STATUS_CONFIG = {
  'On the way': { color: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500', label: 'On the Way 🚐' },
  'Arrived': { color: 'bg-green-100 text-green-800 border-green-200', dot: 'bg-green-500', label: 'Arrived ✓' },
  'Delayed': { color: 'bg-orange-100 text-orange-800 border-orange-200', dot: 'bg-orange-500', label: 'Delayed ⚠️' },
  'Completed': { color: 'bg-gray-100 text-gray-700 border-gray-200', dot: 'bg-gray-400', label: 'Trip Completed' },
};

const VanTrackingPage = () => {
  const { currentUser } = useAuth();
  const [assignment, setAssignment] = useState(null);
  const [van, setVan] = useState(null);
  const [gpsLocation, setGpsLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchTrackingData = async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      // Get parent's active assignment
      const assignments = await pb.collection('assignments').getList(1, 1, {
        filter: `parentId="${currentUser.id}" && status="Active"`,
        expand: 'vanId',
        $autoCancel: false
      });

      if (assignments.items.length > 0) {
        const curr = assignments.items[0];
        setAssignment(curr);
        setVan(curr.expand?.vanId);

        // Try to get live GPS location for this van
        if (curr.expand?.vanId?.id) {
          try {
            const gps = await pb.collection('gpsLocations').getList(1, 1, {
              filter: `vanId="${curr.expand.vanId.id}"`,
              sort: '-created',
              $autoCancel: false
            });
            if (gps.items.length > 0) setGpsLocation(gps.items[0]);
          } catch (_) { /* GPS collection may not have data yet */ }
        }
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 600);
    }
  };

  useEffect(() => {
    fetchTrackingData();
    const interval = setInterval(() => fetchTrackingData(true), 30000);
    return () => clearInterval(interval);
  }, [currentUser.id]);

  // Build map embed URL — use real GPS coords if available, else show Lake City
  const mapSrc = gpsLocation?.latitude && gpsLocation?.longitude
    ? `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d500!2d${gpsLocation.longitude}!3d${gpsLocation.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2spk!4v${Date.now()}`
    : LAKE_CITY_EMBED;

  const vanStatus = gpsLocation?.status || 'On the way';
  const statusCfg = STATUS_CONFIG[vanStatus] || STATUS_CONFIG['On the way'];

  return (
    <>
      <Helmet><title>Live Tracking - SafeRide</title></Helmet>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 flex items-center gap-3">
              <Navigation className="w-7 h-7 text-yellow-500" /> Live Van Tracking
            </h1>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-xs text-gray-400 hidden sm:block">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <Button variant="outline" size="sm" onClick={() => fetchTrackingData()} disabled={refreshing} className="bg-white border-gray-200">
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
                <p className="text-gray-500 text-sm">Loading tracking data...</p>
              </div>
            </div>
          ) : !assignment ? (
            <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="text-xl font-bold text-gray-700 mb-2">No Active Assignment</h2>
              <p className="text-gray-500 max-w-sm mx-auto">Your child has not been assigned to a van yet. Please contact SafeRide administration.</p>
              <a href="tel:+923001234567" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-blue-800 text-white rounded-xl font-medium hover:bg-blue-900 transition-colors">
                <Phone className="w-4 h-4" /> Call Admin
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Map */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col" style={{ minHeight: 450 }}>
                <div className="bg-blue-900 text-white px-4 py-3 flex justify-between items-center text-sm">
                  <span className="font-medium flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-yellow-400" />
                    {gpsLocation ? 'Live GPS Feed' : 'Service Area Map'}
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-200 text-xs">
                    <span className={`w-2 h-2 rounded-full ${gpsLocation ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></span>
                    {gpsLocation ? 'GPS Active' : 'Estimated Location'}
                  </span>
                </div>
                <div className="flex-grow relative">
                  <iframe
                    src={mapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Van Location"
                  />
                </div>
              </div>

              {/* Info Panel */}
              <div className="space-y-4">
                {/* Van Status Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border mb-4 ${statusCfg.color}`}>
                    <span className={`w-2 h-2 rounded-full ${statusCfg.dot} animate-pulse`}></span>
                    {statusCfg.label}
                  </div>

                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Truck className="w-6 h-6 text-blue-800" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Van {van?.vanId}</h2>
                      <p className="text-sm text-gray-500">{van?.licensePlate || 'School Transport'}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50">
                      <div className="p-2 bg-yellow-50 rounded-lg"><Clock className="w-4 h-4 text-yellow-600" /></div>
                      <div>
                        <p className="text-xs text-gray-400">Est. Arrival</p>
                        <p className="font-bold text-gray-900 text-sm">{gpsLocation?.eta || '~10 mins'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50">
                      <div className="p-2 bg-blue-50 rounded-lg"><MapPin className="w-4 h-4 text-blue-600" /></div>
                      <div>
                        <p className="text-xs text-gray-400">Current Location</p>
                        <p className="font-medium text-gray-900 text-sm">{gpsLocation?.locationName || 'Lake City, Lahore'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-2.5">
                      <div className="p-2 bg-green-50 rounded-lg"><Navigation className="w-4 h-4 text-green-600" /></div>
                      <div>
                        <p className="text-xs text-gray-400">Driver</p>
                        <p className="font-medium text-gray-900 text-sm">{van?.driverName || 'Assigned Driver'}</p>
                        {van?.driverPhone && <p className="text-xs text-gray-400">{van.driverPhone}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trip Progress */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-4 text-sm">Today's Journey</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Departed School', done: true, time: assignment.departureTime || '2:05 PM' },
                      { label: 'En Route', done: vanStatus !== 'Completed', active: vanStatus === 'On the way', time: '' },
                      { label: 'Arrival Home', done: vanStatus === 'Arrived' || vanStatus === 'Completed', time: '' },
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.done ? 'bg-green-500' : step.active ? 'bg-blue-500 animate-pulse' : 'bg-gray-200'
                        }`}>
                          {step.done ? <CheckCircle2 className="w-4 h-4 text-white" /> : (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <span className={`text-sm font-medium ${step.done ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</span>
                          {step.time && <span className="text-xs text-gray-400 ml-2">{step.time}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call Driver */}
                <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-100">
                  <h3 className="font-bold text-yellow-800 mb-1 text-sm">Need Help?</h3>
                  <p className="text-xs text-yellow-700 mb-3">Contact the driver or SafeRide admin for any urgent concerns.</p>
                  <div className="flex flex-col gap-2">
                    {van?.driverPhone ? (
                      <a href={`tel:${van.driverPhone}`} className="flex items-center justify-center gap-2 w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2.5 rounded-xl text-sm transition-colors">
                        <Phone className="w-4 h-4" /> Call Driver
                      </a>
                    ) : null}
                    <a href="tel:+923001234567" className="flex items-center justify-center gap-2 w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-2.5 rounded-xl text-sm border border-gray-200 transition-colors">
                      <Phone className="w-4 h-4" /> Call SafeRide: +92 300 1234567
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VanTrackingPage;
