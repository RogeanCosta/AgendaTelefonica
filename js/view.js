class ContactView {
  constructor() {
    this.contactList = document.getElementById('contactTableBody');
    this.addButton = document.getElementById('addButton');
    this.contactModal = document.getElementById('modal');
    this.closeModalButton = document.querySelector('.modal .close');
    this.saveButton = document.getElementById('saveButton');
    this.nameInput = document.getElementById('name');
    this.phoneInput = document.getElementById('phone');
    this.emailInput = document.getElementById('email');

    // Fechar modal ao clicar no X
    this.closeModalButton.onclick = () => this.closeModal();

    // Fechar modal ao clicar fora do modal
    window.onclick = (event) => {
      if (event.target === this.contactModal) {
        this.closeModal();
      }
    };
  }

  render(contacts) {
    this.contactList.innerHTML = '';
    contacts.forEach((contact, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>${contact.phone}</td>
                <td>
                    <button class="editButton" data-index="${index}">Editar</button>
                    <button class="deleteButton" data-index="${index}">Excluir</button>
                </td>
            `;
      this.contactList.appendChild(row);
    });

    // Adicionar eventos de clique para editar e excluir
    this.contactList.querySelectorAll('.editButton').forEach((button) => {
      button.onclick = (event) =>
        this.handleEditContact(event.target.dataset.index);
    });

    this.contactList.querySelectorAll('.deleteButton').forEach((button) => {
      button.onclick = (event) =>
        this.handleDeleteContact(event.target.dataset.index);
    });
  }

  showModal(contact = { name: '', phone: '', email: '' }) {
    this.nameInput.value = contact.name;
    this.phoneInput.value = contact.phone;
    this.emailInput.value = contact.email;
    this.contactModal.style.display = 'block';
  }

  closeModal() {
    this.contactModal.style.display = 'none';
  }

  getContactDetails() {
    return {
      name: this.nameInput.value,
      phone: this.phoneInput.value,
      email: this.emailInput.value,
    };
  }

  handleDeleteContact(index) {
    // Definido pelo controller
  }

  handleEditContact(index) {
    // Definido pelo controller
  }
}
