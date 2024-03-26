administration_table = document.getElementById('administration-table')
people_table = document.getElementById('people-table')

let data = JSON.parse(localStorage.getItem('quizz_data'))  


if ( data ) {
  data.goToClassement = true


    _administration_table = [
        {
            rank : 1,
            administration : "TRACFIN",
            points : "1050",
            tendance : "up"
        },
        {
            rank : 2,
            administration : "DGFiP",
            points : "1030",
            tendance : "down"
        },
        {
            rank : 3,
            administration : "DG Trésor",
            points : "980",
            tendance : "up"
        },
        {
            rank : 4,
            administration : "Douane",
            points : "950",
            tendance : "down"
        },
        {
            rank : 5,
            administration : "DGCCRF",
            points : "860",
            tendance : "down"
        }
    ]

    _administration_table.forEach(row => {
        body = administration_table.getElementsByTagName('TBODY')[0]
        rank = document.createElement('th')
        rank.setAttribute('scope', 'row')
        rank.append(row.rank)

        administration = document.createElement('td')
        administration.append(row.administration)

        points = document.createElement('td')
        points.append(row.points)

        tendance = document.createElement('td')
        tendance.setAttribute('class', 'tendance-'+row.tendance)


        body.appendChild(document.createElement('tr'))
            .append(tendance, rank, administration, points)
    });

    _people_table.forEach(row => {
        body = people_table.getElementsByTagName('TBODY')[0]
        pseudo = document.createElement('th')
        pseudo.setAttribute('scope', 'row')
        pseudo.append(row.pseudo)

        administration = document.createElement('td')
        administration.append(row.administration)

        points = document.createElement('td')
        points.append(row.points)

        tendance = document.createElement('td')
        tendance.setAttribute('class', 'tendance-'+row.tendance)


        body.appendChild(document.createElement('tr'))
            .append(tendance, pseudo, administration, points)
    });
} else {
    alert('Fait d\'abord un test')
    location.href = "index.html"
}