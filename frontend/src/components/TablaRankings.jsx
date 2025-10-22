// src/components/TablaRankings.jsx
import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";

export default function TablaRankings() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();

  const handlerRowClick = (rank, team, points, region, normalizedTeam) => {
    const teamInfo = { rank, team, points, region, normalizedTeam};
    sessionStorage.setItem('teamInfo', JSON.stringify(teamInfo));
    navigate("/team-details");
  };

  useEffect(() => {
    fetch('http://localhost:5000/latest-valve-ranking') 
      .then(res => res.json())
      .then(data => {
        setRankings(data.rankings || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching rankings:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={loadingStyle}>Cargando rankings...</p>;
  if (rankings.length === 0) return <p style={loadingStyle}>No hay rankings para mostrar.</p>;

  return (
    <><h1>Ranking de Equipos</h1><table style={tableStyle}>
      <thead>
        <tr style={headerRowStyle}>
          <th style={thStyle}>Rank</th>
          <th style={thStyle}>Team</th>
          <th style={thStyle}>Points</th>
          <th style={thStyle}>Region</th>
        </tr>
      </thead>
      <tbody>
        {rankings.map(({ rank, team, points, region, normalizedTeam }, index) => (
          <tr
            key={rank}
            style={index % 2 === 0 ? evenRowStyle : oddRowStyle}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3a3f3d'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#2c2f2e' : '#252827'}
            onClick={() => handlerRowClick(rank, team, points, region, normalizedTeam)}
          >
            <td style={tdStyle}>{rank}</td>
            <td style={tdStyle}>{team}</td>
            <td style={tdStyle}>{points}</td>
            <td style={tdStyle}>{region}</td>
          </tr>
        ))}
      </tbody>
    </table></>
  );
}

// Estilos

const loadingStyle = {
  color: '#a3d9a5',
  fontWeight: 'bold',
  textAlign: 'center',
  marginTop: 20,
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  color: '#a3d9a5',
  backgroundColor: '#1e1e1e',
  boxShadow: '0 0 15px #3db13d',
  borderRadius: 8,
  overflow: 'hidden',
  marginTop: 20,
};

const headerRowStyle = {
  backgroundColor: '#3db13d',
  color: '#111',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  fontSize: 16,
};

const thStyle = {
  padding: '12px 15px',
  borderBottom: '2px solidrgb(161, 200, 44)',
  textAlign: 'left',
};

const tdStyle = {
  padding: '12px 15px',
  borderBottom: '1px solidrgb(102, 102, 43)',
};

const evenRowStyle = {
  backgroundColor: '#2c2f2e',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const oddRowStyle = {
  backgroundColor: '#252827',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};
