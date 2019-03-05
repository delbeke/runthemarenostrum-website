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

var ApiBaseUrl = 'https://api.runthemarenostrum.com'

function requestStages (cbDone) {
  var oReq = new window.XMLHttpRequest()
  oReq.addEventListener('readystatechange', function (data) {
    if (this.readyState === 4 && this.status === 200) {
      var receivedStages = JSON.parse(this.responseText)
      cbDone(receivedStages.filter(s => s.hide !== true))
    }
  })
  oReq.open('GET', ApiBaseUrl + '/stages/')
  oReq.send()
}

function requestStageDetails (stageId, cbDone) {
  var oReq = new window.XMLHttpRequest()
  oReq.addEventListener('readystatechange', function (data) {
    if (this.readyState === 4 && this.status === 200) {
      cbDone(JSON.parse(this.responseText))
    }
  })
  oReq.open('GET', ApiBaseUrl + '/stages/' + stageId)
  oReq.send()
}

function htmlEscape(str) {
  return str
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
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
  var monthButton = document.createElement('button')
  monthButton.textContent = text
  monthButton.className = 'button'
  container.appendChild(monthButton)
  monthButton.addEventListener('click', function () {
    var buttons = container.querySelectorAll('button')
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].className = 'button'
    }
    monthButton.className = 'button selected'
    onClick(value)
  })
}

function create (parent, tagName, className, content) {
  var el = document.createElement(tagName)
  el.className = className || ''
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
  if (taken) {
    create(stageBox, 'div', 'triangle')
    create(stageBox, 'div', 'triangle-text', 'Stage Taken')
  }
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
    warning.innerHTML = "Loading info..."
    requestStageDetails(stage.stageId, (details => {
      var team = details.officialTeam
      var html = 'This stage is taken by team "' + htmlEscape(team.name) + '" with '
      html += team.members.length + (team.members.length === 1 ? ' member' : ' members') + ': '
      for (let i = 0; i < team.members.length; i++) {
        var member = team.members[i]
        var country = htmlEscape(member.country || '')
        html += htmlEscape(member.firstName) + ' (<span title="' + country + '" class="flag-icon flag-icon-' + country.toLowerCase() + '"></span>), '
      }
      if (team.members.length > 0) {
        html = html.substring(0, html.length - 2)
      }
      warning.innerHTML = html + '.'
    }))
  }

  // list details
  var setNodeValue = function(node, value) {
    var valueNode = node.querySelector('.value')
    valueNode.innerHTML = value
    valueNode.title = value
  }

  var details = document.querySelector('.step.s-3 .details')
  var nodesToClear = details.querySelectorAll('.details > div > div')
  for(var i = 0; i < nodesToClear.length; i++) {
    var nodeToClear = nodesToClear[i]
    nodeToClear.style.display = 'none'
    setNodeValue(nodeToClear, '')
  }
  var fields = Object.keys(stage)
  var visibleNodeCount = 0
  for(var j = 0; j < fields.length; j++) {
    var field = fields[j]
    var value = stage[field]
    if (value != null) {
      if (typeof value === 'object' && typeof value.join === 'function') {
        value = value.join(', ')
      }
      var node = details.querySelector('.' + field)
      if (node) {
        node.style.display = 'block'
        setNodeValue(node, value)
        visibleNodeCount++
      }
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
  document.getElementById('explainer_stagecount').innerHTML = stages.filter(i => i.stageId.indexOf('BUFFER') === -1).length
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

function padDatePart(nr) {
  var txt = nr.toString()
  if (txt.length === 1) {
    txt = '0' + txt
  }
  return txt
}

function calculateStopDates (stages) {
  var re = /(\d{2})-(\d{2})-(\d{4})/
  for (var i = 0; i < stages.length; i++) {
    if (stages[i].startDate) {
      var parts = re.exec(stages[i].startDate)
      if (parts && parts.length === 4) {
        var startDate = new Date(parseInt(parts[3]), parseInt(parts[2]), parseInt(parts[1]))
        var endDate = new Date(startDate.getTime())
        endDate.setDate(startDate.getDate() + 1)
        stages[i].stopDate = padDatePart(endDate.getDate()) + '-' + padDatePart(endDate.getMonth()) + '-' + endDate.getFullYear()
      }
    }
  }
}

if (window.location.href.indexOf('/register') >= 0) {
  window.addEventListener('load', function () {
    requestStages(function (stages) {
      calculateStopDates(stages)
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
