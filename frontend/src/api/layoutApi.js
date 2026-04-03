export const loadLayoutFromServer = async () => {
  try {
    const response = await fetch('http://localhost:5001/api/layout', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Server returned status ${response.status}`;
      console.error('Failed to load layout:', { status: response.status, message: errorMessage });
      throw new Error(`Load failed: ${errorMessage}`);
    }

    const data = await response.json();
    console.log('Layout loaded from server:', data);
    return data;
  } catch (err) {
    if (err instanceof TypeError) {
      console.error('Network error - backend may be unreachable:', err);
      throw new Error('Backend unreachable');
    }
    console.error('Failed to load layout:', err);
    throw err;
  }
};

export const saveLayoutToServer = async (quantities, layout) => {
  try {
    const response = await fetch('http://localhost:5001/api/layout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantities, layout })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Server returned status ${response.status}`;
      console.error('Server sync failed:', { status: response.status, message: errorMessage });
      throw new Error(`Save failed: ${errorMessage}`);
    }

    const data = await response.json();
    console.log('Layout saved successfully:', data);
    return data;
  } catch (err) {
    if (err instanceof TypeError) {
      console.error('Network error - backend may be unreachable:', err);
      throw new Error('Backend unreachable');
    }
    console.error('Failed to save layout:', err);
    throw err;
  }
};
