export * from './profile.interface';


/*


{
  id: '94532',
  username: 'eabdelha',
  displayName: 'El Mahdi Abdelhadi',
  name: { familyName: 'Abdelhadi', givenName: 'El mahdi' },
  profileUrl: 'https://api.intra.42.fr/v2/users/eabdelha',
  emails: [ { value: 'eabdelha@student.1337.ma' } ],
  phoneNumbers: [ { value: 'hidden' } ],
  photos: [ { value: undefined } ],
  provider: '42',
  _raw: '{"id":94532,"email":"eabdelha@student.1337.ma","login":"eabdelha","first_name":"El mahdi","last_name":"Abdelhadi","usual_full_name":"El Mahdi Abdelhadi","usual_first_name":null,"url":"https://api.intra.42.fr/v2/users/eabdelha","phone":"hidden","displayname":"El Mahdi Abdelhadi","kind":"student","image":{"link":"https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg","versions":{"large":"https://cdn.intra.42.fr/users/7d3dc59806c18295ef046b0204412112/large_eabdelha.jpg","medium":"https://cdn.intra.42.fr/users/4b9f725282db4573b946273defb97f98/medium_eabdelha.jpg","small":"https://cdn.intra.42.fr/users/3d80816417c968540906319b904f5e0b/small_eabdelha.jpg","micro":"https://cdn.intra.42.fr/users/bdde40b4127ec09f992850ff1fa5cee5/micro_eabdelha.jpg"}},"staff?":false,"correction_point":4,"pool_month":"august","pool_year":"2021","location":"e1r9p9","wallet":144,"anonymize_date":"2026-06-17T00:00:00.000+01:00","data_erasure_date":"2026-06-17T00:00:00.000+01:00","created_at":"2021-07-29T11:15:12.467Z","updated_at":"2023-06-17T21:31:17.084Z","alumnized_at":null,"alumni?":false,"active?":true,"groups":[],"cursus_users":[{"grade":null,"level":8.77,"skills":[{"id":4,"name":"Unix","level":9.88},{"id":1,"name":"Algorithms \\u0026 AI","level":7.06},{"id":3,"name":"Rigor","level":6.01},{"id":14,"name":"Adaptation \\u0026 creativity","level":5.36},{"id":7,"name":"Group \\u0026 interpersonal","level":0.39}],"blackholed_at":null,"id":131356,"begin_at":"2021-08-02T08:37:00.000Z","end_at":"2021-08-28T08:37:00.000Z","cursus_id":9,"has_coalition":true,"created_at":"2021-07-29T11:15:12.556Z","updated_at":"2021-07-29T11:15:12.556Z","user":{"id":94532,"email":"eabdelha@student.1337.ma","login":"eabdelha","first_name":"El mahdi","last_name":"Abdelhadi","usual_full_name":"El Mahdi Abdelhadi","usual_first_name":null,"url":"https://api.intra.42.fr/v2/users/eabdelha","phone":"hidden","displayname":"El Mahdi Abdelhadi","kind":"student","image":{"link":"https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg","versions":{"large":"https://cdn.intra.42.fr/users/7d3dc59806c18295ef046b0204412112/large_eabdelha.jpg","medium":"https://cdn.intra.42.fr/users/4b9f725282db4573b946273defb97f98/medium_eabdelha.jpg","small":"https://cdn.intra.42.fr/users/3d80816417c968540906319b904f5e0b/small_eabdelha.jpg","micro":"https://cdn.intra.42.fr/users/bdde40b4127ec09f992850ff1fa5cee5/micro_eabdelha.jpg"}},"staff?":false,"correction_point":4,"pool_month":"august","pool_year":"2021","location":"e1r9p9","wallet":144,"anonymize_date":"2026-06-17T00:00:00.000+01:00","data_erasure_date":"2026-06-17T00:00:00.000+01:00","created_at":"2021-07-29T11:15:12.467Z","updated_at":"2023-06-17T21:31:17.084Z","alumnized_at":null,"alumni?":false,"active?":true},"cursus":{"id":9,"created_at":"2015-11-04T10:58:13.979Z","name":"C Piscine","slug":"c-piscine","kind":"piscine"}},{"grade":"Learner","level":9.23,"skills":[{"id":10,"name":"Network \\u0026 system administration","level":8.06},{"id":3,"name":"Rigor","level":7.38},{"id":17,"name":"Object-oriented programming","level":6.38},{"id":2,"name":"Imperative programming","level":4.83},{"id":4,"name":"Unix","level":4.48},{"id":1,"name":"Algorithms \\u0026 AI","level":4.18},{"id":5,"name":"Graphics","level":2.99}],"blackholed_at":"2023-10-29T08:00:00.000Z","id":143876,"begin_at":"2021-11-01T08:00:00.000Z","end_at":null,"cursus_id":21,"has_coalition":true,"created_at":"2021-10-25T09:51:32.997Z","updated_at":"2021-10-25T09:51:32.997Z","user":{"id":94532,"email":"eabdelha@student.1337.ma","login":"eabdelha","first_name":"El mahdi","last_name":"Abdelhadi","usual_full_name":"El Mahdi Abdelhadi","usual_first_name":null,"url":"https://api.intra.42.fr/v2/users/eabdelha","phone":"hidden","displayname":"El Mahdi Abdelhadi","kind":"student","image":{"link":"https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg","versions":{"large":"https://cdn.intra.42.fr/users/7d3dc59806c18295ef046b0204412112/large_eabdelha.jpg","medium":"https://cdn.intra.42.fr/users/4b9f725282db4573b946273defb97f98/medium_eabdelha.jpg","small":"https://cdn.intra.42.fr/users/3d80816417c968540906319b904f5e0b/small_eabdelha.jpg","micro":"https://cdn.intra.42.fr/users/bdde40b4127ec09f992850ff1fa5cee5/micro_eabdelha.jpg"}},"staff?":false,"correction_point":4,"pool_month":"august","pool_year":"2021","location":"e1r9p9","wallet":144,"anonymize_date":"2026-06-17T00:00:00.000+01:00","data_erasure_date":"2026-06-17T00:00:00.000+01:00","created_at":"2021-07-29T11:15:12.467Z","updated_at":"2023-06-17T21:31:17.084Z","alumnized_at":null,"alumni?":false,"active?":true},"cursus":{"id":21,"created_at":"2019-07-29T08:45:17.896Z","name":"42cursus","slug":"42cursus","kind":"main"}}],"projects_users":[{"id":2934927,"occurrence":0,"final_mark":125,"status":"finished","validated?":true,"current_team_id":4622507,"project":{"id":1983,"name":"Inception","slug":"inception","parent_id":null},"cursus_ids":[21],"marked_at":"2023-02-16T17:58:33.125Z","marked":true,"retriable_at":null,"created_at":"2023-01-15T20:49:32.136Z","updated_at":"2023-03-25T19:41:12.582Z"},{"id":2931702,"occurrence":0,"final_mark":125,"status":"finished","validated?":true,"current_team_id":4618020,"project":{"id":1332,"name":"webserv","slug":"webserv","parent_id":null},"cursus_ids":[21],"marked_at":"2023-01-15T20:45:18.154Z","marked":true,"retriable_at":null,"created_at":"2023-01-11T12:38:02.105Z","updated_at":"2023-03-25T19:41:11.593Z"},{"id":2787621,"occurrence":0,"final_mark":125,"status":"finished","validated?":true,"current_team_id":4418827,"project":{"id":1335,"name":"ft_containers","slug":"ft_containers","parent_id":null},"cursus_ids":[21],"marked_at":"2022-10-22T14:43:46.329Z","marked":true,"retriable_at":null,"created_at":"2022-09-15T11:26:57.224Z","updated_at":"2023-03-25T19:41:10.422Z"},{"id":2755348,"occurrence":0,"final_mark":100,"status":"finished","validated?":true,"current_team_id":4369498,"project":{"id":1322,"name":"Exam Rank 04","slug":"exam-rank-04","parent_id":null},"cursus_ids":[21],"marked_at":"2022-09-01T12:42:20.092Z","marked":true,"retriable_at":null,"created_at":"2022-08-30T10:07:44.137Z","updated_at":"2023-03-25T19:41:08.423Z"},{"id":2749168,"occurrence":0,"final_mark":100,"status":"finished","validated?":true,"current_team_id":4359238,"project":{"id":1346,"name":"CPP Module 08","slug":"cpp-module-08","parent_id":null},"cursus_ids":[21],"marked_at":"2022-08-29T15:57:31.378Z","marked":true,"retriable_at":null,"created_at":"2022-08-26T08:43:06.253Z","updated_at":"2023-03-25T19:41:06.944Z"},{"id":2748030,"occurrence":0,"final_mark":100,"status":"finished","validated?":true,"current_team_id":4357800,"project":{"id":1345,"name":"CPP Module 07","slug":"cpp-module-07","parent_id":null},"cursus_ids":[21],"marked_at":"2022-08-25T21:12:44.896Z","marked":true,"retriable_at":null,"created_at":"2022-08-25T17:49:02.982Z","updated_at":"2023-03-25T19:41:05.358Z"},{"id":2744283,"occurrence":0,"final_mark":100,"status":"finished","validated?":true,"current_team_id":4352802,"project":{"id":1344,"name":"CPP Module 06","slug":"cpp-module-06","parent_id":null},"cursus_ids":[21],"marked_at":"2022-08-25T14:21:31.552Z","marked":true,"retriable_at":null,"created_at":"2022-08-24T15:55:52.471Z","updated_at":"2023-03-25T19:41:04.449Z"},{"id":2738874,"occurrence":0,"final_mark":100,"status":"finished","validated?":true,"current_team_id":4344892,"project":{"id":1343,"name":"CPP Module 05","slug":"cpp-module-05","parent_id":null},"cursus_ids":[21],"marked_at":"2022-08-24T15:45:34.832Z","marked":true,"retriable_at":null,"created_at":"2022-08-22T17:41:19.699Z","updated_at":"2023-03-25T19:41:03.230Z"},{"id":2736312,"occurrence":0,"final_mark":100,"status":"finished","validated?":true,"current_team_id":4341415,"project":{"id":1342,"name":"CPP Module 04","slug":"cpp-module-04","parent_id":null},"cursus_ids":[21],"marked_at":"2022-08-22T17:39:27.242Z","marked":true,"retriable_at":null,"created_at":"2022-08-21T20:08:30.026Z","updated_at":"2023-03-25T19:41:02.250Z"},{"id":2735362,"occurrence":0,"final_mark":100,"status":"finished","validated?":true,"current_team_id":4339671,"project":{"id":1341,"name":"CPP Module 03","slug":"cpp-module-03","parent_id":null},"cursus_ids":[21],"marked_at":"2022-08-21T20:07:57.366Z","marked":true,"retriable_at":null,"created_at":"2022-08-20T14:16:17.530Z","updated_at":"2023-03-25T19:41:01.300Z"},{"id":2733223,"occurrence":0,"final_mark":100,"status":"finished","validated?":true,"current_team_id":4336622,"project":{"id":1340,"name":"CPP Module 02","slug":"cpp-module-02","parent_id":null},"cursus_ids":[21],"marked_at":"2022-08-19T21:13:40.286Z","marked":true,"retriable_at":null,"created_at":"2022-08-18T17:50:16.454Z","updated_at":"2023-03-25T19:40:59.865Z"},{"id":2730508,"occurrence":0,"final_mark":100,"status":"finished","validated?":true,"current_team_id":4333405,"project":{"id":1339,"name":"CPP Module 01","slug":"cpp-module-01","parent_id":null},"cursus_ids":[21],"marked_at":"2022-08-18T17:45:32.222Z","marked":true,"retriable_at":null,"created_at":"2022-08-17T19:53:11.807Z","updated_at":"2023-03-25T19:40:57.499Z"},{"id":2641409,"occurrence":0,"final_mark":100,"status":"finished","validated?":true,"current_team_id":4204283,"project":{"id":1338,"name":"CPP Module 00","slug":"cpp-module-00","parent_id":null},"cursus_ids":[21],"marked_at":"2022-08-17T17:26:49.445Z","marked":true,"retriable_at":null,"created_at":"2022-06-29T10:06:32.274Z","updated_at":"2023-03-25T19:40:55.751Z"},{"id":2633173,"occurrence":0,"final_mark":100,"status":"finished","validated?":true,"current_team_id":4193193,"project":{"id":2007,"name":"NetPractice","slug":"netpractice","parent_id":null},"cursus_ids":[21],"marked_at":"2022-06-24T18:25:27.003Z","marked":true,"retriable_at":null,"created_at":"2022-06-22T16:45:14.036Z","updated_at":"2023-03-25T19:40:54.618Z"},{"id":2555094,"occurrence":0,"final_mark":115,"status":"finished","validated?":true,"current_team_id":4086625,"project":{"id":1315,"nam'... 19302 more characters,
  _json: {
    id: 94532,
    email: 'eabdelha@student.1337.ma',
    login: 'eabdelha',
    first_name: 'El mahdi',
    last_name: 'Abdelhadi',
    usual_full_name: 'El Mahdi Abdelhadi',
    usual_first_name: null,
    url: 'https://api.intra.42.fr/v2/users/eabdelha',
    phone: 'hidden',
    displayname: 'El Mahdi Abdelhadi',
    kind: 'student',
    image: {
      link: 'https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg',
      versions: [Object]
    },
    'staff?': false,
    correction_point: 4,
    pool_month: 'august',
    pool_year: '2021',
    location: 'e1r9p9',
    wallet: 144,
    anonymize_date: '2026-06-17T00:00:00.000+01:00',
    data_erasure_date: '2026-06-17T00:00:00.000+01:00',
    created_at: '2021-07-29T11:15:12.467Z',
    updated_at: '2023-06-17T21:31:17.084Z',
    alumnized_at: null,
    'alumni?': false,
    'active?': true,
    groups: [],
    cursus_users: [ [Object], [Object] ],
    projects_users: [
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object]
    ],
    languages_users: [ [Object] ],
    achievements: [
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object]
    ],
    titles: [ [Object] ],
    titles_users: [ [Object] ],
    partnerships: [],
    patroned: [],
    patroning: [],
    expertises_users: [],
    roles: [],
    campus: [ [Object] ],
    campus_users: [ [Object] ]
  }
}

*/