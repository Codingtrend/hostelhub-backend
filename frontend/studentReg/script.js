// script.js

document.getElementById('admin').addEventListener('click', () => {
  sendRoleSelection('Admin');
});
document.getElementById('hosteller').addEventListener('click', () => {
  sendRoleSelection('Hosteller');
});
document.getElementById('warden').addEventListener('click', () => {
  sendRoleSelection('Warden');
});

function sendRoleSelection(role) {
  fetch('/select-role', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: role }), // Sending the selected role
  })
  .then((response) => response.json())
  .then((data) => {
    console.log('Role selected:', data);
    // Optionally, redirect after selection or show a success message
  })
  .catch((error) => console.error('Error:', error));
}
