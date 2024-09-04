# Bond Service Interview Assignment

Tento návod je určen pro uživatele používající linuxovou distribuci, ideálně **Debian/Ubuntu**.

## požadavky

### Make
V rámci projektu se využívá nástroj [Make](https://www.gnu.org/software/make/), který zjednodušuje spouštění opakujících se příkazů prostřednictvím předdefinovaných cílů (targetů) v souboru *Makefile*.

**Make** lze nainstalovat pomocí příkazu: `sudo apt install make`

### Docker + Docker Compose
Projekt je kontejnerizován pomocí Dockeru, proto je potřeba mít nainstalovaný Docker i Docker Compose.

- instalace Dockeru https://docs.docker.com/engine/install/
- instalace Docker Compose https://docs.docker.com/compose/install/

## spuštění projektu
Následující **Make** příkazy je potřeba spouštět v kořenové složce projektu.

Při prvním spuštění je třeba použít následující příkaz `make setup_project`, který buildne Docker images a inicializuje nezbytné nastavení.

Projekt se spouští příkazem `make up` (nastartuje Docker kontejnery). Webová aplikace bude poté dostupná na adrese http://127.0.0.1:8088/

Přihlašovací údaje:
- jméno: admin
- heslo: 1122

Projekt se vypína příkazem `make down` (zastaví Docker kontejnery)

## API dokumentace
API dokumentace je dostupná na adrese http://127.0.0.1:8088/api/schema/swagger-ui/

## spuštění testů
`make test`
