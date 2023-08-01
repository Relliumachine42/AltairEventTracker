const events = [
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 240000,
        date: "06/01/2017",
    },
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 250000,
        date: "06/01/2018",
    },
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 257000,
        date: "06/01/2019",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 130000,
        date: "06/01/2017",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 140000,
        date: "06/01/2018",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 150000,
        date: "06/01/2019",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 40000,
        date: "06/01/2017",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 45000,
        date: "06/01/2018",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 50000,
        date: "06/01/2019",
    },
];

function getEvents() {
    let storedEvents = JSON.parse(localStorage.getItem('gs-events') || '[]');

    if (storedEvents.length == 0) {
        storedEvents = events;
        localStorage.setItem('gs-events', JSON.stringify(events));
    }
    return storedEvents;
}

function buildDropDown() {

    // get events
    let currentEvents = getEvents();

    // get a list of unique cities

    let eventCities = currentEvents.map(e => e.city);
    let distinctCitites = new Set(eventCities);
    let dropdownChoices = ['All', ...distinctCitites];

    const dropdownDiv = document.getElementById('city-dropdown');
    const dropdownItemTemplate = document.getElementById('dropdown-template');

    dropdownDiv.innerHTML = '';

    // with each unique city:
    dropdownChoices.forEach(loc => {
        // -copy dropdown template
        let dropdownItemCopy = dropdownItemTemplate.content.cloneNode(true);
        // -change the copy's text
        let aTag = dropdownItemCopy.querySelector('a');
        aTag.innerText = loc;
        // -put it in the dropdown
        dropdownDiv.appendChild(dropdownItemCopy);
    });
    document.getElementById('stats-location').textContent = 'All';
    displayEvents(currentEvents);
    displayStats(currentEvents);
}

function displayEvents(events) {

    // find the table on the page
    const eventsTable = document.getElementById('events-table');
    // find the table row template
    const eventTemplate = document.getElementById('table-row-template');

    // clear out the table
    eventsTable.innerHTML = '';

    // for each event:
    for (let i = 0; i < events.length; i++) {
        // --get one event
        let event = events[i];
        // --clone the template
        let tableRow = eventTemplate.content.cloneNode(true);
        // --get each property of an event
        // --insert each property into the cloned template
        tableRow.querySelector('[data-id="event"]').innerText = event.event;
        tableRow.querySelector('[data-id="city"]').innerText = event.city;
        tableRow.querySelector('[data-id="state"]').innerText = event.state;
        tableRow.querySelector('[data-id="attendance"]').innerText = event.attendance.toLocaleString();
        tableRow.querySelector('[data-id="date"]').innerText = new Date(event.date).toLocaleDateString();

        // Object.keys(event).forEach(key => {
        // });
        // --insert the event data into the table
        eventsTable.appendChild(tableRow);
    }

}

function displayStats(events) {
    let total = 0;
    let max = 0;
    let min = events[0].attendance;
    for (let i = 0; i < events.length; i++) {
        let event = events[i];
        total += event.attendance;
        if (event.attendance > max) {
            max = event.attendance;
        }
        if (event.attendance < min) {
            min = event.attendance;
        }
    }
    let average = total / events.length;
    document.getElementById('total-attendance').innerHTML = total.toLocaleString();
    document.getElementById('average-attendance').innerHTML = Math.round(average).toLocaleString();
    document.getElementById('most-attended').innerHTML = max.toLocaleString();
    document.getElementById('least-attended').innerHTML = min.toLocaleString();
}

function filterEvents(dropdownItemClicked) {
    let cityName = dropdownItemClicked.innerText;
    document.getElementById('stats-location').textContent = cityName;
    let filtered = [];
    let allEvents = getEvents();


    if (cityName == 'All') {
        filtered = allEvents;
    } else {
        // allEvents.forEach(event => {
        //     if(cityName == event.city) {
        //         filtered.push(event);
        //     }
        // });

        filtered = allEvents.filter(event => event.city == cityName);
    }

    // filtered = allEvents.filter(event => cityName == 'All' || event.city == cityName);

    displayStats(filtered);
    displayEvents(filtered);
}

function saveElement() {
    let eventName = document.getElementById('EventName').value;
    let city = document.getElementById('City').value;
    let stateSelect = document.getElementById('State');
    let state = stateSelect.options[stateSelect.selectedIndex].text;
    let attendance = parseInt(document.getElementById('Attendance').value);
    let dateString = `${document.getElementById('eventDate').value} 00:00`;
    let eventDate = new Date(dateString).toLocaleDateString();
    let newEvent = {
        event: eventName,
        city,
        state,
        attendance,
        date: eventDate,
    };
    let allEvents = getEvents();
    allEvents.push(newEvent);
    localStorage.setItem('gs-events', JSON.stringify(allEvents));
    document.getElementById('newForm').reset();
    buildDropDown();

    let modal = bootstrap.Modal.getInstance(document.getElementById('addData'));
    modal.hide();
}

