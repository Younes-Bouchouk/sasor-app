<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->



![Texte alternatif](https://i.ibb.co/zVGWrJNj/splash-icon-white.png "LOGO DE L'application").

<!-- ABOUT THE PROJECT -->
## Progression de la semaine 

 - Ajout d'une page de messagerie avec tout les évenement rejoins .

 - Nous avons améliorer la messagerie ,a présent la page de message est désormais est maintenant dynamique .
 



<!-- GETTING STARTED -->
## Pour lancer le projet 

on va expliquer étape par étape en deux partie front et back 

### Prérequis

* Installer Node.js
* Télécharger l'application ExpoGo sur votre téléphone _(si vous souhaitez utiliser l'application avec une meilleur experience)_

### Installation

* Cloner le repository
   ```sh
   git clone https://github.com/Younes-Bouchouk/sasor-app.git
   ```

##### - Backend

* Pointer vers le dossier backend
  ```sh
  cd backend
  ```
* Installer les dépendances
  ```sh
  npm install 
  ```

* migrer la bdd 
  ```sh
 npx prisma migrate dev --name init 
 ```
 * génerer le client prisma 
  ```sh
 npx prisma generate  
 ```


##### - Frontend

* Pointer vers le dossier frontend
  ```sh
  cd frontend
  ```
* Installer les dépendances
  ```sh
  npm install 
  ```

### Lancement de l'application

##### - Lancer le backend

* Pointer vers le dossier backend
  ```sh
  cd backend
  ```
* Lancer en mode developpement
  ```sh
  npm run dev 
  ```

##### - Lancer le frontend

* Pointer vers le dossier frontend
  ```sh
  cd frontend
  ```
* Ouvrir le fichier _**/services/api.ts**_, et remplacer la première ligne par : 
    ```sh
    export const API_BASE_URL = "http://[votre_ip]:4000";
    ```

* Lancer en mode développement
  ```sh
  npm run dev 
  ```






<!-- CONTRIBUTING -->
## Contributing

### Top contributors:

<a href="https://github.com/Younes-Bouchouk/sasor-app/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Younes-Bouchouk/sasor-app" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the Unlicense License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Khalid Harrari - Younes bouchouk  - Larbi derdouri

Project Link: [https://github.com/Younes-Bouchouk/sasor-app.git](https://github.com/Younes-Bouchouk/sasor-app.git)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
