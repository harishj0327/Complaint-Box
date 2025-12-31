from geopy.distance import geodesic

RADIUS_METERS = 300

def is_within_radius(lat1, lon1, lat2, lon2):
    distance = geodesic((lat1, lon1), (lat2, lon2)).meters
    return distance <= RADIUS_METERS
