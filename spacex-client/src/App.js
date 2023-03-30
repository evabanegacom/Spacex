import React, { useState, useEffect } from 'react';

function App() {
  const [capsules, setCapsules] = useState([]);
  const [filters, setFilters] = useState({});

  // Fetch capsules data from API
  useEffect(() => {
    const url = `http://localhost:5000/spacex-capsules?${getQueryParams(filters)}`
    console.log({url})
    fetch(`http://localhost:5000/spacex-capsules?${getQueryParams(filters)}`)
      .then(response => response.json())
      .then(data => setCapsules(data));
  }, [filters]);

  // Helper function to generate query parameters from filters object
  const getQueryParams = (filters) => {
    let queryParams = '';
    for (let key in filters) {
      if (filters[key]) {
        queryParams += `${key}=${filters[key]}&`;
      }
    }
    return queryParams;
  }

  console.log({capsules})

  // Handler functions for filter buttons
  const handleStatusFilter = (status) => {
    setFilters({...filters, 'status': status});
  }
  const handleLaunchFilter = (launch) => {
    setFilters({...filters, 'original_launch': launch});
  }
  const handleTypeFilter = (type) => {
    setFilters({...filters, 'type': type});
  }

  return (
    <div>
      <h1>SpaceX Capsules</h1>
      <div>
        <button onClick={() => handleStatusFilter('active')}>Active</button>
        <button onClick={() => handleStatusFilter('retired')}>Retired</button>
      </div>
      <div>
        <button onClick={() => handleLaunchFilter('true')}>Original Launch</button>
        <button onClick={() => handleLaunchFilter('false')}>Reused Launch</button>
      </div>
      <div>
        <button onClick={() => handleTypeFilter('Dragon')}>Dragon</button>
        <button onClick={() => handleTypeFilter('Crew Dragon')}>Crew Dragon</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Original Launch</th>
            <th>Missions</th>
          </tr>
        </thead>
        <tbody>
          {capsules?.map(capsule => (
            <tr key={capsule.id}>
              <td>{capsule.name}</td>
              <td>{capsule.type}</td>
              <td>{capsule.status}</td>
              <td>{capsule.original_launch}</td>
              {/* <td>{capsule.missions.map(mission => mission.name).join(', ')}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
