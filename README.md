# swpp2019-team12
[![Build Status](https://travis-ci.org/swsnu/swpp2019-team12.svg?branch=master)](https://travis-ci.org/swsnu/swpp2019-team12)
[![Coverage Status](https://coveralls.io/repos/github/swsnu/swpp2019-team12/badge.svg?branch=master)](https://coveralls.io/github/swsnu/swpp2019-team12?branch=master)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swpp2019-team12&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swpp2019-team12)



### WARINNG
- Coverage
  - 뱃지에서는 0% 로 뜨지만 실제 coveralls에 들어가면 **80%** 가 넘어있습니다. 뱃지 말고 페이지에서 확인해주시면 감사하겠습니다.
- Sonar Cloud
  - 소나클라우드 역시 master 코드가 제대로 반영되지 않은 것으로 판단됩니다. 최대한 빠르게 설정 수정하겠습니다. 



### How to run Frontend
`Yarn install`

`Yarn start`



### How to run Server
`cd server`

`python manage.py makemigrations meetingoverflow`

`python manage.py migrate`

`pip install -r requirements.txt`

`python manage.py runserver`
