# CRUD de Agenda Telefônica

Este projeto é um aplicativo de agenda telefônica simples implementado utilizando o padrão **MVC (Model-View-Controller)**, junto com HTML, CSS e JavaScript. Ele permite que o usuário adicione, edite e exclua contatos. Os contatos são salvos no `localStorage` do navegador, de modo que a lista de contatos persista entre as sessões.

## Estrutura do Projeto

📂 crud-agenda</br>
┣ 📂 css </br>
┃ ┗ 📜 style.css</br>
┣ 📂 js</br>
┃ ┣ 📜 model.js</br>
┃ ┣ 📜 view.js</br>
┃ ┗ 📜 controller.js</br>
┣ 📜 index.html</br>
┗ 📜 README.md</br>

## Descrição de Arquivos

- **index.html**: Estrutura HTML da interface do usuário.
- **style.css**: Arquivo de estilo para a aplicação.
- **model.js**: Implementa a lógica de manipulação dos dados dos contatos (modelo).
- **view.js**: Controla a exibição e interação com o usuário (visualização).
- **controller.js**: Interage com o modelo e a visualização, controlando o fluxo da aplicação (controlador).

## Funcionalidades

- Adicionar novo contato (nome, telefone, email).
- Editar contato existente.
- Excluir contato.
- Listar contatos com atualização em tempo real.
- Persistência dos dados utilizando `localStorage`.

## Arquitetura

O projeto utiliza o padrão **MVC** para separar responsabilidades:

### 1. **Model (model.js)**

O **modelo** é responsável pela lógica dos dados. Ele gerencia a lista de contatos, adiciona novos contatos, remove contatos e notifica os observadores quando os dados são alterados. Além disso, ele salva e carrega os dados do `localStorage`.

```javascript
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
    localStorage.setItem('contacts', JSON.stringify(contactsObj));
  }

  // Carrega os contatos do localStorage
  loadContacts() {
    const contactsData = localStorage.getItem('contacts');
    if (contactsData) {
      const contactsObj = JSON.parse(contactsData);
      return Object.values(contactsObj);
    }
    return [];
  }
}
```

### 2. **View (view.js)**

A **view** é responsável por lidar com o DOM e a interface de usuário. Ela recebe os dados do controller e os renderiza na tela, além de capturar eventos como cliques e entradas de formulário. Abaixo está o código para o `view.js`.

```javascript
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
```

### 3. **Controller (controller.js)**

O **controller** atua conversando com o **model** e a **view**, coordenando a interação do usuário com a aplicação. Ele lida com os eventos gerados pela interface (como cliques) e modifica os dados do model ou a interface de acordo com a lógica necessária. Abaixo está o código do `controller.js`.

```javascript
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
      alert('Por favor, preencha todos os campos.');
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
```

## **Padrão Observer no Projeto**

Neste projeto, o padrão **Observer** é utilizado para garantir que a interface da aplicação (View) seja atualizada automaticamente sempre que houver uma mudança no estado dos dados (Model). O **Observer** permite que o **Model** notifique os observadores (Controllers) quando os dados são alterados, assegurando que a UI esteja sempre sincronizada com os dados.

#### Como funciona o Observer no projeto:

- **Model**: Armazena os dados dos contatos e uma lista de observadores (Controllers) que precisam ser notificados quando os dados mudam.

  - O método `addObserver(observer)` adiciona um observador (Controller) à lista de observadores.
  - O método `notify()` percorre todos os observadores registrados e chama seu método `update()` para avisá-los sobre as mudanças nos dados.
  - A notificação ocorre sempre que um contato é adicionado, editado ou removido, chamando o `notify()` após essas ações.

- **Controller**: O **Controller** se registra como observador do **Model** quando a aplicação é inicializada. Isso acontece no `controller.js`, onde o método `this.model.addObserver(this)` é chamado. Quando o **Model** notifica os observadores, o **Controller** chama o método `update()` para sincronizar a **View** com os dados atualizados.

Esse padrão facilita a separação entre a lógica de dados e a interface do usuário, seguindo os princípios do MVC, e melhora a manutenção e escalabilidade do código.

## **Como Rodar o Projeto**

1. Clone ou faça download deste repositório.
2. Abra o arquivo `index.html` em um navegador web, utilizando-se de algo que simule um servidor(como live server).
3. Você poderá adicionar, editar e excluir contatos, com a lista sendo salva no **localStorage** do navegador.

## **Tecnologias Utilizadas**

- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

A Licença MIT é uma licença permissiva que permite que você faça praticamente qualquer coisa com o código, desde que inclua o aviso de licença e os direitos autorais. Veja um resumo da licença abaixo:

**MIT License**

Copyright (c) 2024 Rogean Costa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
