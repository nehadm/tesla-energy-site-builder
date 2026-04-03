import React, { useEffect, useMemo, useState } from 'react';
import { Box, Container, createTheme, Divider, ThemeProvider } from '@mui/material';

import { loadLayoutFromServer, saveLayoutToServer } from './api/layoutApi';
import Sidebar from './components/Sidebar';
import SiteLayout from './components/SiteLayout';
import SiteLayoutHeader from './components/SiteLayoutHeader';
import SiteLayoutInfoCards from './components/SiteLayoutInfoCards';
import TeslaHeader from './components/TeslaHeader';
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
    const loadData = async () => {
      try {
        const data = await loadLayoutFromServer();
        if (data && data.quantities) {
          setQuantities(data.quantities);
          setStatus('Session loaded from server.');
          localStorage.setItem('tesla-energy-session', JSON.stringify(data.quantities));
        }
      } catch (err) {
        console.error('Failed to load from server, falling back to localStorage:', err.message);
        const saved = localStorage.getItem('tesla-energy-session');
        if (saved) {
          setQuantities(JSON.parse(saved));
          setStatus('Session resumed from local storage.');
        } else {
          setStatus('Starting fresh session.');
        }
      }
    };
    
    loadData();
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
    
    try {
      localStorage.setItem('tesla-energy-session', JSON.stringify(quantities));
    } catch (storageErr) {
      console.error('LocalStorage error:', storageErr);
    }

    try {
      await saveLayoutToServer(quantities, layout);
      setStatus('Configuration saved to server.');
      console.log('Save successful');
    } catch (err) {
      console.error('Save error:', err.message);
      setStatus(`Error: ${err.message}. Saved locally.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', pb: 4 }}>
        <TeslaHeader />
  
        <Container maxWidth={false} disableGutters>
          <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
            <Sidebar
              quantities={quantities}
              onChange={handleQuantityChange}
              onSave={handleSave}
              onReset={handleReset}
              isSaving={loading}
              status={status}
            />
  
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                bgcolor: '#f4f4f4',
                p: 2,
                minHeight: 'calc(100vh - 64px)',
              }}
            >
              <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
                <SiteLayoutHeader />
                <Divider
                  sx={{
                    marginTop: 0,
                    marginBottom: 1,
                    borderColor: '#e2e5e8',
                    borderBottomWidth: 1.5,
                  }}
                />
                <SiteLayoutInfoCards totals={totals} />
                <SiteLayout layout={layout} />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}