'use strict';

const getUrl = (field) => field[0] === `url` ? `<a href="${field[1]}">${field[1]}</a>` : field[1];

const templateItem = (el) => `
  <h2>${el.date}</h2>
  <section>
    ${Object.entries(el).filter((field) => field[1]).map((field) =>`
      <div>
        <strong>${field[0]}</strong>: ${getUrl(field)}
      </div>
    `).join(``)}
  </section>
`;

const template = ({data}) => data.map(templateItem).join(``);

module.exports = template;
