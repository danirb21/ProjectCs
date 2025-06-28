import { useEffect, useState } from 'react';

const containerStyle = {
  maxWidth: '400px',
  margin: '50px auto',
  padding: '20px',
  borderRadius: '20px',
  backgroundColor: '#1e1e1e',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  color: '#ffffff',
  fontFamily: 'Arial, sans-serif',
  textAlign: 'center',
};

const avatarStyle = {
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '3px solid #3a3f3d',
  marginBottom: '20px',
};

const labelStyle = {
  fontWeight: 'bold',
  color: '#cccccc',
  marginTop: '10px',
};

const valueStyle = {
  fontSize: '18px',
  marginBottom: '10px',
};

function TeamDetails() {
  const [teamInfo, setTeamInfo] = useState(null);

  useEffect(() => {
    const rank = sessionStorage.getItem('rank');
    if (rank) {
      setTeamInfo(JSON.parse(rank));
    }
  }, []);

  if (!teamInfo) return <div style={{ color: '#fff', textAlign: 'center' }}>Cargando equipo...</div>;

  const { team, rank, points, region } = teamInfo;

  return (
    <div style={containerStyle}>
      {/* Avatar / Logo del equipo */}
      <img
        src={`https://via.placeholder.com/150?text=${encodeURIComponent(team)}`}
        alt={`Logo de ${team}`}
        style={avatarStyle}
      />

      {/* Información del equipo */}
      <div>
        <div style={labelStyle}>Equipo</div>
        <div style={valueStyle}>{team}</div>

        <div style={labelStyle}>Ranking</div>
        <div style={valueStyle}>#{rank}</div>

        <div style={labelStyle}>Puntos</div>
        <div style={valueStyle}>{points}</div>

        <div style={labelStyle}>Región</div>
        <div style={valueStyle}>{region}</div>
      </div>
    </div>
  );
}

export default TeamDetails;
