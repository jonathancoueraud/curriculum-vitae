const ejs = require('ejs');
const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs'));
const rimraf = bluebird.promisify(require('rimraf'));
const mkdirp = bluebird.promisify(require('mkdirp'));

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


    async function buildHtml() {
        console.log('buildHtml');

        let html = await fs.readFileAsync('./index.ejs', 'utf-8');
        let htmlMap = {
            header: await buildHeaderHtml(),
            resume: await buildResumeHtml(),
            contact: await buildContactHtml(),
            experience: await buildExperienceHtml(),
            formations: await buildFormationHtml(),
            skills: await buildSkillsHtml(),
            languages: await buildLanguagesHtml(),
            projects: await buildProjectsHtml(),
        };

        html = ejs.render(html, htmlMap);

        await fs.writeFileAsync('./www/index.html', html, 'utf-8');
    }

    async function build() {
        await buildHtml();
    }

    console.log('building...');
    await rimraf('./www');
    await mkdirp('./www');

    await build();
}

build().catch((err) => console.error(err.stack));
