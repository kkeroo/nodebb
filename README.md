## Postopek inštalacije
1. kloniramo repozitorij **https://github.com/kkeroo/nodebb.git**
2. prestavimo se v mapo pravkar ustvarjenega repozitorija
3. Poženemo ukaz **docker-compose up --build**, s tem zgradimo sliko
***
### MongoDB
4. Po uradni dokumentaciji NodeBB je pred inštalacijo NodeBB potrebno konfiguirati bazo (v tem primeru MongoDB). Poženemo ukaz **docker exec -it nodebb_db_1 bash**. Ta ukaz nam odpre ukazno lupino za storitev db.
5. V ukazni lupini poženemo ukaz **mongo --authenticationDatabase=admin -u admin -p gesloadmin**. S tem vsopimo v mongo konzolo ter hkrati opravimo avtentikacijo. Zdaj je potrebno ustvariti podatkovno bazo za NodeBB.
6. V mongo konzoli poženemo **use nodebb**, tako ustvarimo bazo z imenom **nodebb** Potrebno je ustvariti uporabnika, to storimo z ukazom **db.createUser({ user: "nodebb", pwd: "geslonodebb", roles: [ { role: "readWrite", db: "nodebb"}, { role: "clusterMonitor", db: "admin" } ] } )**.
7. zdaj lahko zapustimo konzolo z **quit()**.
8. Zadnji korak je, da moramo v ukazni lupini od storitve db, kjer se trenutno nahajamo, spremeniti datoteko **etc/mongod.conf.orig**: dodamo dve vrstici
security:
  authorization: enabled
9. Ko to storimo, z **docker-compose down** ustavimo vse skupaj in še enkrat poženemo z **docker-compose up**.

### PostgreSQL
V docker-compose datoteki, lahko spremenimo okoljske spremenljivke, ki se uporabljajo za ustvaritev baze in dostop do PostgreSQL strežnika. Če želimo do baze dostopati z orodjem (recimo DBeaver), moramo nastaviti **pgAdmin**. Na **localhost:8080** se prijavimo s okoljskimi spremenljivkami nastavljenimi pod pgAdmin servicom. Izberemo **desni klik na Servers in potem Create > Server**. Pod **General** določimo ime serverja, pod **Connection** pa vpišemo **pgsql-server** v **Host name** in pa ostale okoljske spremenljivke. Lahko si pomagate s [to objavo] (https://linuxhint.com/postgresql_docker/). Za dostop do PostgreSQL serverja iz poljubnega IDE-ja je potrebno v IDE-u dodati nov Data Source, kjer pod **HOST** vpišemo **localhost** pod **USER, PASSWORD, DATABASE** pa naše okoljske spremenljivke.
***
## Nadaljevanje inštalacije
10. Na localhost:4567 se nam odpre web installer NodeBB-ja. Ustvariti moramo admin uporabnika, in vnesti podatke za bazo (v našem primeru: username:nodebb, database:nodebb, password: geslonodebb, Host IP: db, port: 27017). Host IP mora biti **db** zaradi Docker networkinga.

### Urejanje datoteke v ukazni lupini storitve db
Da lahko uredimo datoteko potrebujemo urejevalnik besedila. Eden izmed najboljših opcij je **nano**. Dobimo ga z dvema ukazoma **apt-get update** in **apt-get install nano**.

## Inštalacija pluginov in tem
### Ročno napisani plugini in teme
Potrebno je ustvariti simbolno povezavo. Ker če povezave ustvarimo ročno se ob zaustavitvi kontejnerja izgubijo, jih definiramo v **docker-compose.yml** datoteki. Pod servicom **node** se kliče **command**, kjer je potrebno za vsak plugin dodati 4 ukaze, kot je prikazano za plugin quickstart.
Pomembno je da so ukazi v pravilnem vrstem redu:
1. se prestavimo v mapo z pluginom (ukaz cd)
2. poženemo **npm link**
3. se prestavimo v mapo, kjer je inštaliran NodeBB
4. poženemo ukaz **npm link <ime-plugina>**

### Javno dostopni plugini   
Inštaliramo jih prek ACP.

## Back-up baze
### MongoDB
1. za back-up se postavimo v mapo, kjer želimo shraniti back-up in poženemo **mongodump --authenticationDatabase=admin --username=admin --password=gesloadmin --host=localhost --port=27017**
2. za restore baze poženemo **mongorestore --authenticationDatabase=admin --username=admin --password=gesloadmin --host=localhost --port=27017 .** v mapi, kjer se nahaja back-up.
### PostgreSQL
1. za back-up se postavimo v mapo, kjer želimo shraniti back-up in poženemo **docker exec -t nodebb_db_1 pg_dump nodebb -U admin > dump.sql**.
2. za restore baze poženemo **cat dump.sql | docker exec -i nodebb_db_1 -U admin -d nodebb**.
V tem primeru je **nodebb** ime baze, ki jo backup-amo, **admin** je ime uporabnika, ki skrbi za bazo, **nodebb_db_1** je ime storitve, kjer teče baza v Dockerju, **dump.sql** je ime datoteke, v katero se je shranil back-up.
