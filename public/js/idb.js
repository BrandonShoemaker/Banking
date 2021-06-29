let db;

const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function(event){
    const db = event.target.result;

    db.createObjectStore('new_request', {autoIncrement: true});

};


request.onsuccess = function(event){
    db = event.target.result;

    if(navigator.onLine){
        uploadRecords();
    }
};

request.onerror = function(event){
    console.log(event.target.errorCode);
};


function saveRecord(record){
    const transaction = db.transaction(['new_request'], 'readwrite');

    const budgetObjectStore = transaction.objectStore('new_request');

    budgetObjectStore.add(record);
};

function uploadRecords(){
    const transaction = db.transaction(['new_request'], 'readwrite');

    const budgetObjectStore = transaction.objectStore('new_request');

    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function(){
        if(getAll.result.length > 0){
            fetch("/api/transaction", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                  Accept: "application/json, text/plain, */*",
                  "Content-Type": "application/json"
                }
              })
              .then(response => {    
                return response.json();
              })
              .then(serverResponse => {
                if(serverResponse.message){
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(['new_request'], 'readwrite');

                const budgetObjectStore = transaction.objectStore('new_request');

                budgetObjectStore.clear();

                alert('All saved pizza has been submitted!');
              })
              .catch(err => console.log(err));
        }
    }
};


window.addEventListener('online', uploadRecords);