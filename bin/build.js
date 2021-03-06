const ejs = require('ejs');
const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs'));
const rimraf = bluebird.promisify(require('rimraf'));
const mkdirp = bluebird.promisify(require('mkdirp'));
const ncp = bluebird.promisify(require('ncp'));
const sass = bluebird.promisifyAll(require('node-sass'));

const contact = require('../js/shared/data/contact');
const experience = require('../js/shared/data/experience');
const formations = require('../js/shared/data/formations');
const header = require('../js/shared/data/header');
const languages = require('../js/shared/data/languages');
const projects = require('../js/shared/data/projects');
const resume = require('../js/shared/data/resume');
const skills = require('../js/shared/data/skills');

async function build(debug) {
    async function buildHeaderHtml() {
        const html = await fs.readFileAsync('./template/header.ejs', 'utf-8');
        return ejs.render(html, header);
    }

    async function buildResumeHtml() {
        const html = await fs.readFileAsync('./template/resume.ejs', 'utf-8');
        return ejs.render(html, resume);
    }

    async function buildContactHtml() {
        const html = await fs.readFileAsync('./template/contact.ejs', 'utf-8');
        return ejs.render(html, contact);
    }

    async function buildExperienceHtml() {
        const html = await fs.readFileAsync('./template/experience.ejs', 'utf-8');
        return ejs.render(html, experience);
    }

    async function buildFormationHtml() {
        const html = await fs.readFileAsync('./template/formations.ejs', 'utf-8');
        return ejs.render(html, formations);
    }

    async function buildSkillsHtml() {
        const html = await fs.readFileAsync('./template/skills.ejs', 'utf-8');
        return ejs.render(html, skills);
    }

    async function buildLanguagesHtml() {
        const html = await fs.readFileAsync('./template/languages.ejs', 'utf-8');
        return ejs.render(html, languages);
    }

    async function buildProjectsHtml() {
        const html = await fs.readFileAsync('./template/projects.ejs', 'utf-8');
        return ejs.render(html, projects);
    }

    async function buildFabButton() {
        const html = await fs.readFileAsync('./template/fab-button.ejs', 'utf-8');
        return ejs.render(html, projects);
    }

    async function buildMainJs() {
        const js = await fs.readFileAsync('./js/main.js', 'utf-8');
        return ejs.render('<script type="text/javascript">' + js + '</script>', projects);
    }


    async function writeHtml() {
        console.log('writeHtml');

        let html = await fs.readFileAsync('./index.ejs', 'utf-8');
        let htmls = await Promise.all([
            buildHeaderHtml(),
            buildResumeHtml(),
            buildContactHtml(),
            buildExperienceHtml(),
            buildFormationHtml(),
            buildSkillsHtml(),
            buildLanguagesHtml(),
            buildProjectsHtml(),
            buildFabButton(),
            buildMainJs(),
            buildCriticalCss(),
        ]);

        let htmlMap = ['header', 'resume', 'contact', 'experience',
            'formations', 'skills', 'languages', 'projects', 'fabButton',
            'mainJs', 'criticalCss']
                .reduce((prev, crr, index) => {
                    prev[crr] = htmls[index];
                    return prev;
                }, {});

        html = ejs.render(html, htmlMap);

        await fs.writeFileAsync('./www/index.html', html, 'utf-8');
    }

    async function writeStatic() {
        let promises = [
            ncp('./asset', './www/'),
        ];

        await Promise.all(promises);
    }

    async function writeMainCss() {
        console.log('writeMainCss');

        let mainCss = await sass.renderAsync({
            file: './css/main.scss',
        });

        await fs.writeFileAsync('./www/main.css', mainCss.css, 'utf-8');
    }

    async function buildCriticalCss() {
        console.log('buildCriticalCss');

        let font = await fs.readFileAsync('./font/chonburi-regular.ttf');
        let fontBase64 = new Buffer(font, 'utf-8').toString('base64');

        let critical = await sass.renderAsync({
            data: '$base64Url:url(data:application/x-font-woff;charset=utf-8;base64,' + fontBase64 + ');@import \'./css/_main-critical.scss\'',
        });
        
        return critical.css;
    }

    async function build() {
        await writeHtml();
        await writeMainCss();
        await writeStatic();
    }

    console.log('building...');
    await rimraf('./www');
    await mkdirp('./www');

    await build();
}

build().catch((err) => console.error(err.stack));
