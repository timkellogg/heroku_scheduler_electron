require('dotenv').config()

const CronJob  = require('cron').CronJob
const Heroku   = require('heroku-client')
const moment   = require('moment')
const heroku   = new Heroku({ token: process.env.HEROKU_API_TOKEN })

const $app    = document.getElementById('app')
const $env    = document.getElementById('env')
const $val    = document.getElementById('val')
const $time   = document.getElementById('time')
const $submit = document.getElementById('submit')
const $reset  = document.getElementById('reset')

heroku.get('/apps')
    .then(apps => buildAppOptions(apps))
    .catch(err => console.log(err))

$submit.addEventListener('click', () => {
    const time = moment($time.value).toDate()
    
    const app  = $app.value
    const val  = $val.value
    const env  = $env.value

    const patch = {}
    patch[env]  = val

    const job = new CronJob(time, () => {

        heroku.patch(`/apps/${app}/config-vars`, { body: patch })
            .then(res => console.log(res))
            .catch(err => console.log(err))
        }, () => {
            console.log('finished')
        }, true)

    console.log(`job is running: ${job.running}`)
})

$app.addEventListener('change', () => {
    const name = $app.value

    heroku.get(`/apps/${name}/config-vars`)
        .then(vars => buildEnvOptions(vars))
        .catch(err => console.log(err))
})

$reset.addEventListener('click', () => {
    $app.value  = ''
    $time.value = ''
    $env.value  = ''
    $val.value  = ''
    disableOption($env)
    enableOption($app)
})

function buildAppOptions(apps) {
    const options = apps.map(app => {
        const { id, name } = app
        return { id, name }
    })

    clearOptions($app)
    
    for (option in options) {
        const $selectOption = document.createElement('option')
        $selectOption.value = options[option].id
        $selectOption.text  = options[option].name

        $app.add($selectOption)
    }

    enableOption($app)
}

function enableOption(field) {
    field.disabled = false
}

function disableOption(field) {
    field.disabled = true
}

function clearOptions(field) {
    while (field.firstChild) {
        field.removeChild(field.firstChild)
    }
}

function buildEnvOptions(envs) {
    clearOptions($env)

    const options = Object.keys(envs)

    for (option in options) {
        const $selectOption = document.createElement('option')
        $selectOption.value = options[option]
        $selectOption.text  = options[option]

        $env.add($selectOption)
    }

    enableOption($env)
}

