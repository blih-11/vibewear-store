// Shared guest ID — persisted in localStorage so a non-signed-in visitor's
// activity tracking (see App.jsx) and guest checkout orders can all be
// attributed to the same anonymous identity across a browser session.
export function getGuestId() {
  let id = localStorage.getItem('vw_guest_id');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('vw_guest_id', id);
  }
  return id;
}
