var monthToName = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December'
}

function requestStages (cbDone) {
  var ApiBaseUrl = 'https://api.runthemarenostrum.com'
  var oReq = new window.XMLHttpRequest()
  oReq.addEventListener('readystatechange', function (data) {
    if (this.readyState === 4 && this.status === 200) {
      cbDone(JSON.parse(this.responseText))
    }
  })
  oReq.open('GET', ApiBaseUrl + '/stages/')
  oReq.send()
}

function getYears (stages) {
  var years = {}
  for (var i = 0; i < stages.length; i++) {
    var date = stages[i].startDate
    var dateParts = date.split('-')
    years[dateParts[2]] = 1
  }
  var arr = Object.keys(years)
  arr.sort()
  return arr
}

function getMonths (stages, year) {
  var months = {}
  for (var i = 0; i < stages.length; i++) {
    var date = stages[i].startDate
    var dateParts = date.split('-')
    if (dateParts[2] === year) {
      months[dateParts[1]] = 1
    }
  }
  var arr = Object.keys(months)
  arr.sort()
  return arr
}

function filterByMonth (month, year, stages) {
  var result = []
  var searchDate = month + '-' + year
  for (var i = 0; i < stages.length; i++) {
    var stage = stages[i]
    if (stage.startDate.indexOf(searchDate) >= 0) {
      result.push(stage)
    }
  }
  result.sort(function (s1, s2) {
    return ((s1.startDate > s2.startDate) ? 1 : -1)
  })
  return result
}

function makeDateButton (container, text, value, onClick) {
  var monthDiv = document.createElement('button')
  monthDiv.textContent = text
  container.appendChild(monthDiv)
  monthDiv.addEventListener('click', function () {
    var buttons = container.querySelectorAll('button')
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].className = ''
    }
    monthDiv.className = 'selected'
    onClick(value)
  })
}

function create (parent, tagName, className, content) {
  var el = document.createElement(tagName)
  el.className = className
  el.textContent = content || ''
  return parent.appendChild(el)
}

function makeStageRow (container, stage, onClick) {
  var buffer = (stage.stageId.indexOf('BUFFER') >= 0)
  var taken = (stage.officialTeam && stage.officialTeam.length > 0)
  var stageClass = 'stage' + (buffer ? ' buffer' : '')
  var stageBox = create(container, 'div', stageClass)
  stageBox._className = stageClass
  var markerSide = create(stageBox, 'div', 'marker', (taken ? '✔' : ''))
  var leftSide = create(stageBox, 'div', 'left')
  create(leftSide, 'div', 'date', stage.startDate)
  create(leftSide, 'div', 'stageid', (buffer ? '' : 'Stage Nr: ') + stage.stageId)
  var rightSide = create(stageBox, 'div', 'right')
  create(rightSide, 'div', 'start', 'FROM: ' + stage.startCity)
  create(rightSide, 'div', 'stop', 'TO: ' + stage.stopCity)
  stageBox.addEventListener('click', function () {
    onClick(stage)
    var stageBoxes = container.querySelectorAll('.stage')
    for (let i = 0; i < stageBoxes.length; i++) {
      stageBoxes[i].className = stageBoxes[i]._className
    }
    stageBox.className += ' selected'
  })
}

window.initMap = function() {
  // map api loaded
}

function makeStepVisible (step) {
  var stepBox = document.querySelector('.step.s-' + step)
  if (stepBox) {
    stepBox.style.opacity = 1
    stepBox.style.display = 'block'
  }
}

function makeStepInvisible (step) {
  var stepBox = document.querySelector('.step.s-' + step)
  if (stepBox) {
    stepBox.style.opacity = 0
    stepBox.style.display = 'none'
  }
}

function parseCoordinates (text) {
  text = text.split(', ')
  return { lat: parseFloat(text[0]), lng: parseFloat(text[1]) }
}

function renderStageDetails (stage) {
  makeStepVisible(3)
  makeStepVisible(4)
  var buffer = (stage.stageId.indexOf('BUFFER') >= 0)
  var taken = (stage.officialTeam && stage.officialTeam.length > 0)
  if (buffer || taken) {
    window.__selectedStageId = null
    makeStepInvisible(4)
  } else {
    window.__selectedStageId = stage.stageId
    makeStepVisible(4)
  }

  // set warning if needed
  var warning = document.querySelector('.step.s-3 .warning')
  warning.style.display = (buffer || taken) ? 'block' : 'none'
  if (buffer) {
    warning.innerHTML = "This is a buffer stage, so you can't register for this stage (yet)."
  } else if (taken) {
    warning.innerHTML = "This stage is already registered by another team."
  }

  // list details
  var details = document.querySelector('.step.s-3 .details')
  var nodesToClear = details.querySelectorAll('.value')
  for(var i = 0; i < nodesToClear.length; i++) {
    var nodeToClear = nodesToClear[i]
    nodeToClear.innerHTML = ''
    nodeToClear.title = ''
  }
  var fields = Object.keys(stage)
  for(var j = 0; j < fields.length; j++) {
    var field = fields[j]
    var value = stage[field]
    if (typeof value === 'object' && typeof value.join === 'function') {
      value = value.join(', ')
    }
    var node = details.querySelector('.' + field + ' .value')
    if (node) {
      node.innerHTML = value
      node.title = value
    }
  }

  // scroll to map
  window.scrollTo(0, document.querySelector('.step.s-3 .map').offsetTop + (window.innerHeight / 3))
  if (window.__stages_map) {
    var map = window.__stages_map
    var startCx = parseCoordinates(stage.startPos)
    var stopCx = parseCoordinates(stage.stopPos)
    window.__stages_map_marker_start.setPosition(startCx)
    window.__stages_map_marker_stop.setPosition(stopCx)
    window.__stages_map_marker_stop.setVisible(!buffer)
    map.setCenter({ lat: ((startCx.lat + stopCx.lat) / 2), lng: ((startCx.lng + stopCx.lng) / 2) })
    map.setZoom(9)
  }
}

function renderStages (stages) {
  var stagesContainer = document.querySelector('.stages')
  return function (dateObj) {
    makeStepVisible(2)
    stagesContainer.innerHTML = ''
    var matchingStages = filterByMonth(dateObj.month, dateObj.year, stages)
    for (var s = 0; s < matchingStages.length; s++) {
      makeStageRow(stagesContainer, matchingStages[s], renderStageDetails)
    }
  }
}

function renderMonthsForYear (stages, year) {
  var months = getMonths(stages, year)
  var monthContainer = document.querySelector('.months')
  monthContainer.innerHTML = ''
  for (var m = 0; m < months.length; m++) {
    var fullNameMonth = monthToName[months[m]] || months[m]
    makeDateButton(monthContainer, fullNameMonth, {year: year, month: months[m]}, renderStages(stages))
  }
}

if (window.location.href.indexOf('/register') >= 0) {
  window.addEventListener('load', function () {
    requestStages(function (stages) {
      var years = getYears(stages)
      var yearContainer = document.querySelector('.years')
      for (var y = 0; y < years.length; y++) {
        makeDateButton(yearContainer, years[y], years[y], function (year) {
          renderMonthsForYear(stages, year)
        })
      }
      renderMonthsForYear(stages, years[0])
      // (pre)load map
      var start = stages[0].startPos.split(', ')
      var mapContainer = document.querySelector('.map')
      window.__stages_map = new window.google.maps.Map(mapContainer, {
        center: {lat: parseFloat(start[0]), lng: parseFloat(start[1])},
        zoom: 10
      })
      var kmzLayer = new window.google.maps.KmlLayer('https://www.runthemarenostrum.com/maps/m1.kmz')
      kmzLayer.setMap(window.__stages_map)
      window.__stages_map_marker_start = new window.google.maps.Marker({ map: window.__stages_map, title: 'START', label: 'A' })
      window.__stages_map_marker_stop = new window.google.maps.Marker({ map: window.__stages_map, title: 'STOP', label: 'B' })

      var joinBtn = document.querySelector('.join-stage')
      joinBtn.addEventListener('click', function () {
        if (window.__selectedStageId) {
          window.location.href = 'https://panel.runthemarenostrum.com/?registerStageId=' + encodeURIComponent(window.__selectedStageId)
        }
      })
    })
  })
}
