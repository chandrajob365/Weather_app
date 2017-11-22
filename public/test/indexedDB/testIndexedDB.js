const app = {
  DBOpenrequest: '',
  db: {},
  indexedLocations: [],
  objectStore: {}
}

const testUserList = [
  {usn: 12, name: 'Manish', age: 28, sex: 'male'},
  {usn: 14, name: 'Abhishek', age: 31, sex: 'male'},
  {usn: 5, name: 'Anjani', age: 28, sex: 'female'}
]
const openConnection = function () {
  app.DBOpenrequest = window.indexedDB.open('testDB', 1)
  console.log('<openConnection> app.DBOpenrequest = ', app.DBOpenrequest)
  console.log('<openConnection> typeof app.DBOpenrequest = ', typeof app.DBOpenrequest)
  app.DBOpenrequest.onsuccess = onSuccess
  app.DBOpenrequest.onupgradeneeded = onUpgradeNeeded
  app.DBOpenrequest.onabort = onAbort
  app.DBOpenrequest.onerror = onError
}

let onSuccess = () => {
  console.log('DB opened successfully...')
  app.db = app.DBOpenrequest.result
  if (app.db.objectStoreNames.contains('users')) {
    console.log('app.objectStore = ', app.db.transaction('users', 'readonly').objectStore('users'))
    let countReq = app.db.transaction('users', 'readonly').objectStore('users').count()
    countReq.onsuccess = function () {
      console.log('count = ', countReq.result)
      if (countReq.result === 0) addUsers(testUserList)
    }
  }
}

let onUpgradeNeeded = () => {
  console.log('DB upgardeneeded event')
  app.db = app.DBOpenrequest.result
  if (app.db && !app.db.objectStoreNames.contains('users')) {
    app.objectStore = app.db.createObjectStore('users', {keyPath: 'usn'})
    app.objectStore.createIndex('name', 'name', {unique: false})
    app.objectStore.createIndex('age', 'age', {unique: false})
    app.objectStore.createIndex('sex', 'sex', {unique: false})
  }
}

let onAbort = (event) => {
  console.log('Database opening aborted!')
}

let onError = () => {
  console.log('DB opening error : ', app.DBOpenrequest.errorCode)
}

openConnection()

const addUsers = testUserList => {
  let transaction = app.db.transaction('users', 'readwrite')
  let txnObjectStoreName = transaction.objectStore('users')
  testUserList.forEach(user => {
    txnObjectStoreName.add(user)
  })
  console.log('txn = ', transaction)
  console.log('txnObjectStoreName = ', txnObjectStoreName)
  txnObjectStoreName.onsuccess = function (event) {
    console.log('txnObjectStoreName Success')
  }
  transaction.onerror = function (event) {
    console.log('transaction onerror')
  }
  transaction.oncomplete = function (event) {
    console.log('transaction oncomplete')
    readUsers()
  }
}

const readUsers = () => {
  console.log('<readUsers> Entry')
  let request = app.db.transaction('users', 'readonly').objectStore('users').openCursor()
  console.log('<readUsers> request = ', request)
  request.onsuccess = (event) => {
    let cursor = event.target.result
    console.log('cursor = ', cursor)
    if (cursor) {
      console.log('user1.value = ', cursor.value)
      cursor.continue()
    } else {
      console.log('no more results')
    }
  }
}
