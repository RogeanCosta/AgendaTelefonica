class ContactModel {
  constructor() {
    this.contacts = this.loadContacts();
    this.observers = [];
  }

  addContact(contact) {
    this.contacts.push(contact);
    this.saveContacts();
    this.notify();
  }

  removeContact(index) {
    this.contacts.splice(index, 1);
    this.saveContacts();
    this.notify();
  }

  getContacts() {
    return this.contacts;
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  notify() {
    this.observers.forEach((observer) => observer.update());
  }

  // Salva os contatos no localStorage
  saveContacts() {
    const contactsObj = {};
    this.contacts.forEach((contact, index) => {
      contactsObj[`contact${index}`] = contact;
    });
    localStorage.setItem("contacts", JSON.stringify(contactsObj));
  }

  // Carrega os contatos do localStorage
  loadContacts() {
    const contactsData = localStorage.getItem("contacts");
    if (contactsData) {
      const contactsObj = JSON.parse(contactsData);
      return Object.values(contactsObj);
    }
    return [];
  }
}
