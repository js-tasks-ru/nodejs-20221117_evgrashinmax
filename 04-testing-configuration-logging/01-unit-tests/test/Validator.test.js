const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля негатив значение короче', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    it('валидатор проверяет строковые поля негатив значение длиннее', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 6,
        },
      });

      const errors = validator.validate({ name: 'LalalaL' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 6, got 7');
    });

    it('валидатор проверяет строковые поля позитивное', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 6,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(0);
    });

    it('валидатор проверяет числовые поля позитив', () => {
      const validator = new Validator({
        name: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 19 });

      expect(errors).to.have.length(0);
    });

    it('валидатор проверяет числовые поля негатив больше предельного', () => {
      const validator = new Validator({
        name: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 21 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal(`too big, expect 20, got 21`);
    });

    it('валидатор проверяет числовые поля негатив меньше предельного', () => {
      const validator = new Validator({
        name: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 9 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal(`too little, expect 10, got 9`);
    });

    it('ошибка типа аргумента', () => {
      const validator = new Validator({
        name: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: undefined });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got undefined');
    });


    it('ошибка типа аргумента когда больше 1го поля - должен быть возврат только ошибки типа поля', () => {
      const validator = new Validator({
        name: {
          type: 'number',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 9, age: undefined });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got undefined');
    });
  });
});