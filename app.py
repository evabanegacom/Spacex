import requests
from flask import Flask, jsonify, request

app = Flask(__name__)

# Set up SpaceX API endpoint URL
SPACEX_API_URL = 'https://api.spacexdata.com/v4/'

# Define endpoints for filtering
ENDPOINTS = {
    'status': 'status',
    'original_launch': 'original_launch',
    'type': 'type'
}

# Define a function to fetch data from SpaceX API
def get_spacex_capsules(filters=None, page=1, limit=10):
    # Set up query parameters for pagination and filtering
    params = {'limit': limit, 'offset': (page - 1) * limit}
    if filters:
        for key, value in filters.items():
            endpoint = ENDPOINTS.get(key)
            if endpoint:
                params[f'{endpoint}'] = value

    # Send GET request to SpaceX API and return results
    response = requests.get(SPACEX_API_URL + 'capsules', params=params)
    return response.json()

# Define an endpoint for fetching SpaceX capsules data with optional filtering
@app.route('/spacex-capsules', methods=['GET'])
def get_capsules():
    # Parse query parameters for filtering and pagination
    filters = request.args.to_dict()
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))

    # Fetch data from SpaceX API with optional filtering
    capsules_data = get_spacex_capsules(filters=filters, page=page, limit=limit)

    # Return results in JSON format
    return jsonify(capsules_data)

if __name__ == '__main__':
    app.run(debug=True)
