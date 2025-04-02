export const SelectTravelesList=[
    {
        id:1,
        title:'Just Me',
        desc:'A sole traveller in exploration',
        icon:'✈️',
        people:'1'
    },
    {
        id:2,
        title:'A Couple',
        desc:'Two travellers in tandem',
        icon:'🥂',
        people:'2 people'
    },
    {
        id:3,
        title:'Family',
        desc:'A group of fun loving adv',
        icon:'🏠',
        people:'3 to 5 people'
    },
    {
        id:4,
        title:'Friends',
        desc:'A bunch of thrill seekers',
        icon:'📷',
        people:'5 to 10 people'
    }
]


export const SelectBudgetOptions=[
    {
        id:1,
        title:'Cheap',
        desc:'Stay conscious of costs',
        icon:'💵'
    },
    {
        id:2,
        title:'Moderate',
        desc:'Keep cost on average side',
        icon:'💳'
    },
    {
        id:3,
        title:'Luxury',
        desc:'Dont worry about costs',
        icon:'💰'
    },
]

export const AI_PROMPT='Generate travel plan for location:{location},for {totalDays} days for {traveller} people with a {budget} budget, Give me a hotel options list with HotelName ,Hotel address,Price,Hotel Image url,geo coordinates,ratings,descriptions and suggest iterinary with place Name, Place Details,place image url,geo coordinates,ticket pricing rating, Time travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format'