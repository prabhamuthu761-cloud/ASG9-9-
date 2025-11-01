const API_URL = "https://68bfc3599c70953d96f06adc.mockapi.io/contact";
const contactList = document.getElementById("contactList");
const contactForm = document.getElementById("contactForm");
const searchInput = document.getElementById("search");

// Fetch and display all contacts
async function fetchContacts() {
  const res = await fetch(API_URL);
  const contacts = await res.json();
  displayContacts(contacts);
}

//  Display contacts in Bootstrap list
function displayContacts(contacts) {
  contactList.innerHTML = "";
  contacts.forEach(contact => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span><strong>${contact.name}</strong> - ${contact.phone}</span>
      <div>
        <button class="btn btn-outline-warning" onclick="editContact(${contact.id}, '${contact.name}', '${contact.phone}')">Edit</button>
        <button class="btn btn-outline-danger" onclick="deleteContact(${contact.id})">Delete</button>
      </div>
    `;
    contactList.appendChild(li);
  });
}

// Add new contact
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone })
  });

  contactForm.reset();
  fetchContacts();
});

//  Delete a contact
async function deleteContact(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchContacts();
}
//  Edit a contact
async function editContact(id, oldName, oldPhone) {
  const newName = prompt("Edit Name:", oldName);
  const newPhone = prompt("Edit Phone:", oldPhone);

  if (newName && newPhone) {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, phone: newPhone })
    });
    fetchContacts();
  }
}

//  Search contacts
searchInput.addEventListener("input", async (e) => {
  const query = e.target.value.toLowerCase();
  const res = await fetch(API_URL);
  const contacts = await res.json();

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(query) || c.phone.includes(query)
  );

  displayContacts(filtered);
});

// Load contacts on page load
fetchContacts();