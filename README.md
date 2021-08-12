## Postopek inštalacije
1. kloniramo repozitorij **https://github.com/kkeroo/nodebb.git**
2. prestavimo se v mapo pravkar ustvarjenega repozitorija
3. Poženemo ukaz **docker-compose up --build**, s tem zgradimo sliko
4. Po uradni dokumentaciji NodeBB je pred inštalacijo NodeBB potrebno konfiguirati bazo (v tem primeru MongoDB). Poženemo ukaz **docker exec -it nodebb_db_1 bash**. Ta ukaz nam odpre ukazno lupino za storitev db.
5. V ukazni lupini poženemo ukaz **mongo --authenticationDatabase=admin -u admin -p gesloadmin**. S tem vsopimo v mongo konzolo ter hkrati opravimo avtentikacijo. Zdaj je potrebno ustvariti podatkovno bazo za NodeBB.
6. V mongo konzoli poženemo **use nodebb**, tako ustvarimo bazo z imenom **nodebb** Potrebno je ustvariti uporabnika, to storimo z ukazom **db.createUser({ user: "nodebb", pwd: "geslonodebb", roles: [ { role: "readWrite", db: "nodebb"}, { role: "clusterMonitor", db: "admin" } ] } )**.
7. zdaj lahko zapustimo konzolo z **quit()**.
8. Zadnji korak je, da moramo v ukazni lupini od storitve db, kjer se trenutno nahajamo, spremeniti datoteko **etc/mongod.conf.orig**: dodamo dve vrstici
security:
  authorization: enabled
9. Ko to storimo, z **docker-compose down** ustavimo vse skupaj in še enkrat poženemo z **docker-compose up**.
10. Na localhost:4567 se nam odpre web installer NodeBB-ja. Ustvariti moramo admin uporabnika, in vnesti podatke za bazo (v našem primeru: username:nodebb, database:nodebb, password: geslonodebb, Host IP: db, port: 27017). Host IP mora biti **db** zaradi Docker networkinga.

### Urejanje datoteke v ukazni lupini storitve db
Da lahko uredimo datoteko potrebujemo urejevalnik besedila. Eden izmed najboljših opcij je **nano**. Dobimo ga z dvema ukazoma **apt-get update** in **apt-get install nano**.

### Inštalacija pluginov in tem
#### Ročno napisani plugini in teme
Potrebno je ustvariti simbolno povezavo. To se stori tako, da odpremo ukazno lupino storitve **nodebb_node_1** na isti način kot smo storili prej. potem se prestavimo v mapo, kjer je naš plugin in poženemo **npm link**, nato se prestavimo v mapo, kjer je inštaliran NodeBB in poženemo **npm link ime-plugina**.

#### Javno dostopni plugini   
inštaliramo jih na enak princip, prek ACP.

#### Back-up baze
1. za back-up se postavimo v mapo, kjer želimo shraniti back-up in poženemo **mongodump --authenticationDatabase=admin --username=admin --password=gesloadmin --host=localhost --port=27017**
2. za restore baze poženemo **mongorestore --authenticationDatabase=admin --username=admin --password=gesloadmin --host=localhost --port=27017 .** v mapi, kjer se nahaja back-up.
