# fisca.js

:construction: en cours de construction.

Étant donné une structure décrivant une entité fiscale (entreprise ou individu salarié), fisca.js retourne l’exercice fiscale sous la forme d'un arbre contenant l'ensemble des charges et dépenses.


## Example

### Structure

```yaml
structure:
  label: mon entreprise
  status: sasu
  revenues: 100000
  costs:
  - label: consommables
    amount: 5000
  - label: frais de bouche
    amount: 5000
  employees:
  - label: moi
    gross_monthly_salary: 3750,
    cadre: true
```

### Résultat

```
├─ label: Chiffre d'affaire
├─ amount: 100000
├─ group
│  └─ 0
│     ├─ label: Charges
│     ├─ amount: 103130.62
│     └─ group
│        ├─ 0
│        │  ├─ label: Charges externes
│        │  ├─ amount: 10000
│        │  └─ group
│        │     ├─ 0
│        │     │  └─ label: consommables
│        │     │  └─ amount: 5000
│        │     └─ 1
│        │        └─ label: frais de bouche
│        │        └─ amount: 5000
│        └─ 1
│           └─ group
│              └─ 0
│                 ├─ label: Salaires
│                 ├─ amount: 93130.62
│                 └─ group
│                    └─ 0
│                       ├─ label: Salaire
│                       ├─ amount: 93130.62
│                       └─ group
│                          ├─ 0
│                          │  ├─ label: Charges patronale
│                          │  ├─ amount: 48130.62
│                          │  └─ group
│                          │     ├─ 0
│                          │     │  ├─ label: Assurance maladie
│                          │     │  └─ amount: 5800.499999999999
│                          │     ├─ 1
│                          │     │  ├─ label: Assurance vieillesse plafonnée
│                          │     │  └─ amount: 33539.94
│                          │     ├─ 2
│                          │     │  ├─ label: Assurance vieillesse déplafonnée
│                          │     │  └─ amount: 855
│                          │     ├─ 3
│                          │     │  ├─ label: Allocations familiales
│                          │     │  └─ amount: 2362.5
│                          │     ├─ 4
...
```

# Usage

:construction: en cours de construction.

La librairie n'est pas encore publié sur *npm*, mais le sera prochainement.

En attendant, pour voir à quoi ça ressemble, après avoir cloné le projet, `npm test` affichera le résultat de l'exercice fiscal pour la structure décrite plus haut.
