class ContactController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.addButton.onclick = () => this.openAddModal();
    this.view.handleDeleteContact = (index) => this.deleteContact(index);
    this.view.handleEditContact = (index) => this.openEditModal(index);
    this.view.saveButton.onclick = (event) => this.saveContact(event);

    this.model.addObserver(this);
    this.update();
  }

  openAddModal() {
    this.view.showModal();
    this.isEditing = false;
    this.currentIndex = null;
  }

  openEditModal(index) {
    const contact = this.model.getContacts()[index];
    this.view.showModal(contact);
    this.isEditing = true;
    this.currentIndex = index;
  }

  saveContact(event) {
    event.preventDefault();

    const contact = this.view.getContactDetails();
    if (contact.name && contact.phone && contact.email) {
      if (this.isEditing) {
        this.model.contacts[this.currentIndex] = contact;
      } else {
        this.model.addContact(contact);
      }
      this.model.saveContacts(); // Atualiza o localStorage
      this.view.closeModal();
      this.update();
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  }

  deleteContact(index) {
    this.model.removeContact(index);
  }

  update() {
    const contacts = this.model.getContacts();
    this.view.render(contacts);
  }
}

// Inicializando a aplicação
window.onload = () => {
  const app = new ContactController(new ContactModel(), new ContactView());
};
