document.addEventListener('DOMContentLoaded', () => {
  const usersTable = document.getElementById('users-table');
  const userSearchForm = document.getElementById('user-search-form');
  const usernameInput = document.getElementById('username-input');
  const userInfo = document.getElementById('user-info');
  const userName = document.getElementById('user-name');
  const userCategory1 = document.getElementById('user-category1');
  const userCategory2 = document.getElementById('user-category2');
  const userCategory3 = document.getElementById('user-category3');
  const userTotalCategory1 = document.getElementById('user-total-category1');
  const userTotalCategory2 = document.getElementById('user-total-category2');
  const userTotalCategory3 = document.getElementById('user-total-category3');

  const fetchUsers = async () => {
    const response = await fetch('http://localhost:3002/api/users');
    const users = await response.json();
    return users;
  };

  const renderUsers = (users) => {
    usersTable.innerHTML = '';
    users.forEach((user) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${user.username}</td><td>${user.category1}</td><td>${user.category2}</td><td>${user.category3}</td>`;
      usersTable.appendChild(row);
    });
  };

  const fetchUser = async (username) => {
    try {
      const response = await fetch(`http://localhost:3002/api/users/${username}`);
      if (response.status === 404) {
        alert('Пользователь не найден');
        return;
      }

      if (!response.ok) {
        console.error(`Error fetching user: ${response.statusText}`);
        return;
      }

      const user = await response.json();
      renderUser(user);
    } catch (error) {
      console.error(`Error fetching user: ${error.message}`);
    }
  };

  const renderUser = (user) => {
    if (user === null) {
      console.error('User not found');
      alert('Пользователь не найден');
      return;
    }

    userName.textContent = user.username;
    userCategory1.textContent = user.category1;
    userCategory2.textContent = user.category2;
    userCategory3.textContent = user.category3;
    userTotalCategory1.textContent = user.totalCategory1;
    userTotalCategory2.textContent = user.totalCategory2;
    userTotalCategory3.textContent = user.totalCategory3;
    userInfo.style.display = 'block';
  };

  userSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = usernameInput.value.trim();
    if (username) {
      fetchUser(username);
    } else {
      alert('Пожалуйста, введите имя пользователя');
    }
  });

  let currentSortField = '';
  let currentSortDirection = '';

  const sortUsers = (users, field, direction) => {
    return users.sort((a, b) => {
      if (a[field] < b[field]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[field] > b[field]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const onTableHeaderClick = (event) => {
    const field = event.target.dataset.field;
    if (!field) {
      return;
    }

    const newSortDirection = currentSortField === field && currentSortDirection === 'asc' ? 'desc' : 'asc';
    currentSortField = field;
    currentSortDirection = newSortDirection;

    fetchUsers().then(users => {
      const sortedUsers = sortUsers(users, currentSortField, currentSortDirection);
      renderUsers(sortedUsers);
    });
  };

  const tableHeaders = document.querySelectorAll('table thead th');
  tableHeaders.forEach(header => header.addEventListener('click', onTableHeaderClick));

  fetchUsers().then(users => renderUsers(users));
});