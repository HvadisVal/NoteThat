const API_BASE = process.env.REACT_APP_API_URL!;

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  return await res.json();
};

export const fetchNotes = async (token: string) => {
  const res = await fetch(`${API_BASE}/notes`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }  });
  return res.json();
};

export const createNote = async (note: any, token: string) => {
  const res = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(note)
  });
  return res.json();
};

export const updateNote = async (id: string, note: any, token: string) => {
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(note)
  });
  return res.json();
};

export const deleteNote = async (id: string, token: string) => {
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }  });
  return res.json();
};

export const fetchTasks = async (id:string, token: string ) => {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  } });
  return res.json();
};

