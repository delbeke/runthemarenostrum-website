function requestStages (cbDone) {
  var ApiBaseUrl = 'https://rn9kdjiwn6.execute-api.eu-central-1.amazonaws.com/dev'
  var oReq = new window.XMLHttpRequest()
  oReq.addEventListener('readystatechange', function (data) {
    if (this.readyState === 4 && this.status === 200) {
      cbDone(JSON.parse(this.responseText))
    }
  })
  oReq.open('GET', ApiBaseUrl + '/stages/')
  oReq.send()
}

function getMonths (stages) {
  var months = {}
  for (var i = 0; i < stages.length; i++) {
    var date = stages[i].startDate
    var dateParts = date.split('-')
    months[(dateParts[2] + ' - ' + dateParts[1])] = 1
  }
  var arr = Object.keys(months)
  arr.sort()
  return arr
}

function filterByMonth (month, stages) {
  var result = []
  var dateParts = month.split(' - ')
  var searchDate = dateParts[1] + '-' + dateParts[0]
  for (var i = 0; i < stages.length; i++) {
    var stage = stages[i]
    if (stage.startDate.indexOf(searchDate) >= 0) {
      result.push(stage)
    }
  }
  return result
}

function makeDateButton (container, date, onClick) {
  var monthDiv = document.createElement('div')
  monthDiv.textContent = date
  container.appendChild(monthDiv)
  monthDiv.addEventListener('click', function () {
    onClick(date)
  })
}

function makeStageRow (container, stage, onClick) {
  var stageBox = document.createElement('div')
  stageBox.textContent = stage.startDate + ': ' + stage.startCity + ' -> ' + stage.stopCity + ' (' + stage.country.join(', ') + ')'
  container.appendChild(stageBox)
  stageBox.addEventListener('click', function () {
    onClick(stage)
  })
}

function initMap () {
  // map api loaded
}

function renderMap (stage) {
  var start = stage.startPos.split(', ')
  var map = new window.google.maps.Map(document.querySelector('.map'), {
    center: {lat: parseFloat(start[0]), lng: parseFloat(start[1])},
    zoom: 8
  })
}

function renderStages (stagesContainer, stages) {
  return function (month) {
    stagesContainer.innerHTML = ''
    var matchingStages = filterByMonth(month, stages)
    for (var s = 0; s < matchingStages.length; s++) {
      makeStageRow(stagesContainer, matchingStages[s], renderMap)
    }
  }
}

if (window.location.href.indexOf('/register') >= 0) {
  window.addEventListener('load', function () {
    requestStages(function (stages) {
      var months = getMonths(stages)
      var monthContainer = document.querySelector('.months')
      var stagesContainer = document.querySelector('.stages')
      for (var m = 0; m < months.length; m++) {
        makeDateButton(monthContainer, months[m], renderStages(stagesContainer, stages))
      }
    })
  })
}
