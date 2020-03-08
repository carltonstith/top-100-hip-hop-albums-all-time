class Album {
  constructor(title, artist, releaseDate, id) {
    this.title = title;
    this.artist = artist;
    this.releaseDate = releaseDate;
    this.id = id;
  }
}

class UI {
  addAlbumToList(album) {
    const list = document.getElementById('album-list');
    // create table row element
    const row = document.createElement('tr');
    // Insert cols
    row.innerHTML = `
      <td>${album.title}</td>
      <td>${album.artist}</td>
      <td>${album.releaseDate}</td>
      <td>${album.id}</td>
      <td><a href="#" class="delete">X</a></td>
    `;
    list.appendChild(row);
  }

  showAlert(message, className) {
    const div = document.createElement('div');
    // Add classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector('.container');
    const form = document.querySelector('#album-form');
    // Insert Alert
    container.insertBefore(div, form);
    // Timeout after 3 seconds
    setTimeout(function() {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  deleteAlbum(target) {
    if(target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('artist').value = '';
    document.getElementById('releaseDate').value = '';
    document.getElementById('id').value = '';
  }
}

class Store {
  static getAlbums() {
    let albums;
    if(localStorage.getItem('albums') === null) {
      albums = [];
    } else {
      albums = JSON.parse(localStorage.getItem('albums'));
    }

    return albums;
  }

  static displayAlbums() {
    const albums = Store.getAlbums();

    albums.forEach(function(album) {
      const ui = new UI;

      // Add album to the UI
      ui.addAlbumToList(album);
    })
  }

  static addAlbum(album) {
    const albums = Store.getAlbums();

    albums.push(album);

    localStorage.setItem('albums', JSON.stringify(albums));
  }

  static removeAlbum(id) {
    const albums = Store.getAlbums();

    albums.forEach(function(album, index) {
      if(album.id === id) {
        albums.splice(index, 1);
      }
    });

    localStorage.setItem('albums', JSON.stringify(albums));
  }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayAlbums());

// Event Listener for Adding an Album
document.getElementById('album-form').addEventListener('submit', function(e) {
  
  // Get form values
  const title = document.getElementById('title').value,
        artist = document.getElementById('artist').value,
        releaseDate = document.getElementById('releaseDate').value,
        id = document.getElementById('id').value;

  // Instantiate an Album
  const album = new Album(id, title, artist, releaseDate, id);

  // Instantiate the UI
  const ui = new UI();

  // Validate and add album to list, add to local storage and show alert
  if(title === '' || artist === '' || releaseDate === '' || id === '') {
    // Show error alert
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    // Add album to list
    ui.addAlbumToList(album);
    // Add the album to local storage
    Store.addAlbum(album);
    // Show alert
    ui.showAlert('Album Added!', 'success');
    // Clear the fields
    ui.clearFields();
  }; 

  e.preventDefault();
});

// Event Listener to Delete an Album
document.getElementById('album-list').addEventListener('click', function(e) {
  //Instantiate the UI
  const ui = new UI();
  // Delete an Album
  ui.deleteAlbum(e.target);
  // Remove the album from Local Storage
  Store.removeAlbum(e.target.parentElement.previousElementSibling.textContent);
  // Show Alert
  ui.showAlert('Album removed!', 'success');

  e.preventDefault();
});