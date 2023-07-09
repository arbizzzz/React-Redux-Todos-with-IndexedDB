export const OpenDatabase = async (databaseName, version, upgradeCallback) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(databaseName, version);

    request.onerror = function (event) {
      reject('Database error: ' + event.target.errorCode);
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      upgradeCallback(db);
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      resolve(db);
    };
  });
};

export const AddToObjectStore = async (db, objectStoreName, data) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([objectStoreName], 'readwrite');
    const objectStore = transaction.objectStore(objectStoreName);

    const request = objectStore.add(data);

    request.onsuccess = function (event) {
      resolve({ message: 'Data added successfully.', id: event.target.result });
    };

    request.onerror = function (event) {
      reject('Error adding data: ' + event.target.error);
    };
  });
};

export const GetDataByKey = (db, objectStoreName, key) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([objectStoreName], 'readonly');
    const objectStore = transaction.objectStore(objectStoreName);

    const request = objectStore.get(key);

    request.onsuccess = function (event) {
      const item = event.target.result;
      resolve(item);
    };

    request.onerror = function (event) {
      reject('Error retrieving data: ' + event.target.error);
    };
  });
};

export const UpdateData = (db, objectStoreName, key, updatedData) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([objectStoreName], 'readwrite');
    const objectStore = transaction.objectStore(objectStoreName);

    const request = objectStore.get(key);

    request.onsuccess = function (event) {
      const item = event.target.result;
      Object.assign(item, updatedData);

      const updateRequest = objectStore.put(item);
      updateRequest.onsuccess = function (event) {
        resolve('Data updated successfully.');
      };
    };

    request.onerror = function (event) {
      reject('Error updating data: ' + event.target.error);
    };
  });
};

export const DeleteDataByKey = (db, objectStoreName, key) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([objectStoreName], 'readwrite');
    const objectStore = transaction.objectStore(objectStoreName);

    const request = objectStore.delete(key);

    request.onsuccess = function (event) {
      resolve('Data deleted successfully.');
    };

    request.onerror = function (event) {
      reject('Error deleting data: ' + event.target.error);
    };
  });
};

export const upgradeCallback = (db) => {
  if (!db.objectStoreNames.contains('todos')) {
    const objectStore = db.createObjectStore('todos', {
      keyPath: 'id',
      autoIncrement: true,
    });
    objectStore.createIndex('titleIndex', 'title', { unique: false });
  }
};

export const getAllDataFromObjectStore = (db, objectStoreName) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(objectStoreName, 'readonly');
    const objectStore = transaction.objectStore(objectStoreName);
    const request = objectStore.openCursor();
    const data = [];

    request.onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        data.push(cursor.value);
        cursor.continue();
      } else {
        resolve(data);
      }
    };

    request.onerror = function (event) {
      reject('Error retrieving data: ' + event.target.error);
    };
  });
};
