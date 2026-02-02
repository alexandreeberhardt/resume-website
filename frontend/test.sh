#!/bin/bash

# =============================================================================
# Script de tests E2E pour Sivee CV Generator
# =============================================================================

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Répertoire du script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Fonction d'aide
show_help() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  Tests E2E - Sivee CV Generator${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "Usage: ${GREEN}./test.sh${NC} [commande] [options]"
    echo ""
    echo -e "${YELLOW}Commandes:${NC}"
    echo "  install       Installer les dépendances et navigateurs Playwright"
    echo "  all           Exécuter tous les tests (défaut)"
    echo "  ui            Ouvrir l'interface graphique Playwright"
    echo "  headed        Exécuter avec navigateur visible"
    echo "  debug         Mode debug avec breakpoints"
    echo "  report        Afficher le rapport HTML"
    echo ""
    echo -e "${YELLOW}Par navigateur:${NC}"
    echo "  chrome        Tests sur Chrome uniquement"
    echo "  firefox       Tests sur Firefox uniquement"
    echo "  safari        Tests sur Safari/WebKit uniquement"
    echo "  mobile        Tests sur émulateurs mobiles"
    echo ""
    echo -e "${YELLOW}Par fonctionnalité:${NC}"
    echo "  auth          Tests d'authentification"
    echo "  landing       Tests de la landing page"
    echo "  editor        Tests de l'éditeur de CV"
    echo "  resumes       Tests de gestion des CV"
    echo "  export        Tests d'export PDF"
    echo "  i18n          Tests d'internationalisation"
    echo "  a11y          Tests d'accessibilité"
    echo "  account       Tests de la page compte"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo "  --grep <pattern>   Filtrer les tests par nom"
    echo "  --workers <n>      Nombre de workers parallèles"
    echo "  --retries <n>      Nombre de retries en cas d'échec"
    echo "  --update-snapshots Mettre à jour les snapshots"
    echo ""
    echo -e "${YELLOW}Exemples:${NC}"
    echo "  ./test.sh install              # Première installation"
    echo "  ./test.sh                      # Tous les tests"
    echo "  ./test.sh ui                   # Interface graphique"
    echo "  ./test.sh chrome --headed      # Chrome avec navigateur visible"
    echo "  ./test.sh editor --grep 'save' # Tests editor contenant 'save'"
    echo ""
}

# Vérifier si npm est installé
check_npm() {
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}Erreur: npm n'est pas installé${NC}"
        exit 1
    fi
}

# Installer les dépendances
install_deps() {
    echo -e "${BLUE}Installation des dépendances...${NC}"
    npm install

    echo -e "${BLUE}Installation des navigateurs Playwright...${NC}"
    npx playwright install

    echo -e "${GREEN}Installation terminée !${NC}"
}

# Vérifier que Playwright est installé
check_playwright() {
    if [ ! -d "node_modules/@playwright" ]; then
        echo -e "${YELLOW}Playwright n'est pas installé. Installation...${NC}"
        install_deps
    fi
}

# Nettoyer les anciens résultats
clean_results() {
    rm -rf playwright-report test-results e2e/screenshots 2>/dev/null || true
}

# Exécuter les tests
run_tests() {
    local args="$@"

    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  Exécution des tests E2E${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    npx playwright test $args

    local exit_code=$?

    if [ $exit_code -eq 0 ]; then
        echo ""
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}  Tous les tests ont réussi !${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    else
        echo ""
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${RED}  Certains tests ont échoué${NC}"
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo -e "Exécutez ${YELLOW}./test.sh report${NC} pour voir le rapport détaillé"
    fi

    return $exit_code
}

# Point d'entrée principal
main() {
    check_npm

    # Récupérer la commande
    local cmd="${1:-all}"
    shift 2>/dev/null || true

    # Options supplémentaires passées au script
    local extra_args="$@"

    case "$cmd" in
        -h|--help|help)
            show_help
            ;;
        install)
            install_deps
            ;;
        all)
            check_playwright
            clean_results
            run_tests $extra_args
            ;;
        ui)
            check_playwright
            npx playwright test --ui $extra_args
            ;;
        headed)
            check_playwright
            clean_results
            run_tests --headed $extra_args
            ;;
        debug)
            check_playwright
            npx playwright test --debug $extra_args
            ;;
        report)
            npx playwright show-report
            ;;
        chrome|chromium)
            check_playwright
            clean_results
            run_tests --project=chromium $extra_args
            ;;
        firefox)
            check_playwright
            clean_results
            run_tests --project=firefox $extra_args
            ;;
        safari|webkit)
            check_playwright
            clean_results
            run_tests --project=webkit $extra_args
            ;;
        mobile)
            check_playwright
            clean_results
            run_tests --project=mobile-chrome --project=mobile-safari $extra_args
            ;;
        auth)
            check_playwright
            clean_results
            run_tests e2e/auth.unauth.spec.ts $extra_args
            ;;
        landing)
            check_playwright
            clean_results
            run_tests e2e/landing.spec.ts $extra_args
            ;;
        editor)
            check_playwright
            clean_results
            run_tests e2e/editor.spec.ts $extra_args
            ;;
        resumes)
            check_playwright
            clean_results
            run_tests e2e/resumes.spec.ts $extra_args
            ;;
        export)
            check_playwright
            clean_results
            run_tests e2e/export.spec.ts $extra_args
            ;;
        i18n)
            check_playwright
            clean_results
            run_tests e2e/i18n.spec.ts $extra_args
            ;;
        a11y|accessibility)
            check_playwright
            clean_results
            run_tests e2e/accessibility.spec.ts $extra_args
            ;;
        account)
            check_playwright
            clean_results
            run_tests e2e/account.spec.ts $extra_args
            ;;
        *)
            # Si c'est un fichier .spec.ts, l'exécuter directement
            if [[ "$cmd" == *.spec.ts ]]; then
                check_playwright
                clean_results
                run_tests "e2e/$cmd" $extra_args
            else
                echo -e "${RED}Commande inconnue: $cmd${NC}"
                echo ""
                show_help
                exit 1
            fi
            ;;
    esac
}

# Exécuter le script
main "$@"
