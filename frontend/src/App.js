import React, { useMemo, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { Container, Grid, Divider, Box} from '@mui/material';
import SiteLayout from './components/SiteLayout';
import SiteLayoutHeader from './components/SiteLayoutHeader';
import SiteLayoutInfoCards from './components/SiteLayoutInfoCards';

import TeslaHeader from './components/TeslaHeader';
import Sidebar from './components/Sidebar';

import { DEVICES } from './constants';
import calculateTotals from './utils/calculateTotals';
import generateLayout from './utils/generateLayout';
import theme from './utils/theme';

export default function App() {
  const [quantities, setQuantities] = useState({
    MEGAPACK_XL: 0, MEGAPACK_2: 0, MEGAPACK: 0, POWERPACK: 0
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Ready');

  useEffect(() => {
    const saved = localStorage.getItem('tesla-energy-session');
    if (saved) {
      setQuantities(JSON.parse(saved));
      setStatus('Session resumed from local storage.');
    }
  }, []);

  const { totals, layout } = useMemo(() => {
    const { units: layout, metrics } = generateLayout(quantities);
    const batteryList = Object.entries(quantities).flatMap(([type, count]) => {
      const spec = DEVICES[type];
      return spec && count > 0 ? Array(count).fill(spec) : [];
    });
    return { 
      totals: calculateTotals(quantities), 
      layout: layout
    };
  }, [quantities]);

  const handleQuantityChange = (type, value) => {
    setQuantities(prev => ({ ...prev, [type]: Math.max(0, parseInt(value) || 0) }));
  };

  const handleReset = () => {
    setQuantities({
      MEGAPACK_XL: 0, MEGAPACK_2: 0, MEGAPACK: 0, POWERPACK: 0
    });
    setStatus('Inputs reset to zero.');
  };

  const handleSave = async () => {
    setLoading(true);
    setStatus('Syncing with server...');
    
    localStorage.setItem('tesla-energy-session', JSON.stringify(quantities));

    try {

      const response = await fetch('http://localhost:5001/api/layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantities, layout })
      });

      if (response.ok) {
        setStatus('Configuration saved to server.');
      } else {
        throw new Error('Server sync failed');
      }
    } catch (err) {
      console.error(err);
      setStatus('Saved locally (Backend unreachable).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', pb: 4 }}>
        <TeslaHeader />
        <Container maxWidth={false} sx={{ mt: 0, p: '0 !important' }}> 
          <Grid container sx={{ minHeight: 'calc(100vh - 64px)' }}>
            <Sidebar 
              quantities={quantities}
              onChange={handleQuantityChange}
              onSave={handleSave}
              onReset={handleReset}
              isSaving={loading}
              status={status}
            />

            <Grid item xs={12} md={9} lg={9.5} sx={{ bgcolor: '#f4f4f4', p: 4, minHeight: '100vh' }}>
              <Box sx={{ maxWidth: '1400px', margin: '0 auto' }}>
                <SiteLayoutHeader /> 
                <Divider sx={{ marginTop: 0, marginBottom: 1, borderColor: '#e2e5e8', borderBottomWidth: 1.5 }} />
                <SiteLayoutInfoCards totals={totals} />
                <SiteLayout layout={layout} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}