# Bond Service Interview Assignment

Tento návod je napsaný pro uživatele používající linuxovou distribuci ideálně **Debian/Ubuntu**

## požadavky

### Make
V rámci projektu se používá [Make](https://www.gnu.org/software/make/) ke snadnému spuštění některých nejčastěji opakovaných příkazů, které jsou předdefinované v souboru Makefile.

**Make** se může nainstalovat pomocí `sudo apt install make`

### Docker + Docker Compose
Projekt je kontejnerizován pomocí Dockeru a proto je potřeba ho mít nainstalovaný. Je potřeba mít nainstalovaný i Docker Compose.

- instalace Dockeru https://docs.docker.com/engine/install/
- instalace Docker Compose https://docs.docker.com/compose/install/

## spuštění projektu
Při prvním spuštění je potřeba spustit příkaz `make setup_project` což buildne Docker images a inicializuje nutný prvotní nastavení.

Projekt se pak spouští příkazem `make up` (nastartuje Docker kontejnery). Následně je možné vstopit do webové applikace na adrese http://127.0.0.1:8088/

Projekt se vypína příkazem `make down` (stopne Docker kontejnery)

## API dokumentace
`API dokumentace je přístupná na adrese http://127.0.0.1:8088/api/schema/swagger-ui/

## spuštění testů
`make test`
