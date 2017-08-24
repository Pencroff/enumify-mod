import { Enum } from '../src/enumify-mod';

describe('Enum test', () => {
  describe('Enum: instantiation', () => {
    it('should instantiate Enum by "extends"', done => {
      class Color extends Enum {
        static RED: Color;
        static GREEN: Color;
        static BLUE: Color;
      }
      Color.initEnum(['RED', 'GREEN', 'BLUE']);
      expect(Color.RED).toBeInstanceOf(Enum);
      expect(Color.RED).toBeInstanceOf(Color);
      done();
    });
    it('should instantiate Enum by "create"', done => {
      const Color = Enum.create('Color', ['RED', 'GREEN', 'BLUE']);
      expect(Color.RED).toBeInstanceOf(Enum);
      expect(Color.RED).toBeInstanceOf(Color);
      done();
    });
  });
  describe('Enum: simple', () => {
    let Color;
    beforeEach(done => {
      Color = Enum.create('Color', ['RED', 'GREEN', 'BLUE']);
      done();
    });
    it('instanceof', done => {
      expect(Color.RED).toBeInstanceOf(Enum);
      expect(Color.RED).toBeInstanceOf(Color);
      done();
    });
    it('toString', () => {
      expect(String(Color.RED)).toEqual('Color.RED');
      expect(Color.RED.toString()).toEqual('Color.RED');
    });
    it('should return ordinal value in "valueOf" call by default', done => {
      expect(Color.RED.valueOf()).toEqual(0);
      expect(Color.GREEN.valueOf()).toEqual(1);
      done();
    });
    it('should return declared value in "valueOf" call', done => {
      Color = Enum.create('Color', {
        RED: '#F00',
        GREEN: '#0F0',
        BLUE: '#00F',
      });
      expect(Color.RED.valueOf()).toEqual('#F00');
      expect(Color.GREEN.valueOf()).toEqual('#0F0');
      done();
    });
    it('should return value from attached objects in "valueOf" call', done => {
      Color = Enum.create('Color', {
        RED: {
          value: '#F00',
          alias: 'red',
        },
        GREEN: {
          value: '#0F0',
          alias: 'green',
        },
        BLUE: {
          value: '#00F',
          alias: 'blue',
        },
      });
      expect(Color.RED.valueOf()).toEqual('#F00');
      expect(Color.GREEN.valueOf()).toEqual('#0F0');
      done();
    });
    it('should keep additional fields from attached objects', done => {
      Color = Enum.create('Color', {
        RED: {
          value: '#F00',
          alias: 'red',
        },
        GREEN: {
          value: '#0F0',
          alias: 'green',
        },
        BLUE: {
          value: '#00F',
          alias: 'blue',
        },
      });
      expect(Color.RED.valueOf()).toEqual('#F00');
      expect(Color.RED.alias).toEqual('red');
      expect(Color.GREEN.valueOf()).toEqual('#0F0');
      expect(Color.GREEN.alias).toEqual('green');
      done();
    });
    it('should apply ordinal for attached objects', done => {
      Color = Enum.create('Color', {
        RED: {
          alias: 'red',
        },
        GREEN: {
          alias: 'green',
        },
        BLUE: {
          alias: 'blue',
        },
      });
      expect(Color.RED.valueOf()).toEqual(0);
      expect(Color.RED.alias).toEqual('red');
      expect(Color.GREEN.valueOf()).toEqual(1);
      expect(Color.GREEN.alias).toEqual('green');
      done();
    });
    it('should be not equal to declared value', done => {
      Color = Enum.create('Color', {
        RED: '#F00',
        GREEN: '#0F0',
        BLUE: '#00F',
      });
      expect(Color.RED === '#F00').toEqual(false);
      expect(Color.GREEN === '#0F0').toEqual(false);
      done();
    });
    it('should implement "fromValue" method', done => {
      Color = Enum.create('Color', {
        RED: '#F00',
        GREEN: '#0F0',
        BLUE: {
          alias: 'blue',
        },
      });
      expect(Color.fromValue('#0F0')).toEqual(Color.GREEN);
      expect(Color.fromValue(2)).toEqual(Color.BLUE);
      done();
    });
    it('should implement "fromName" method', done => {
      Color = Enum.create('Color', {
        RED: '#F00',
        GREEN: '#0F0',
        BLUE: '#00F',
      });
      expect(Color.fromName('GREEN')).toEqual(Color.GREEN);
      expect(Color.fromName('BLUE')).toEqual(Color.BLUE);
      done();
    });
    it('should support "enumValues"', done => {
      expect(Color.enumValues).toEqual([Color.RED, Color.GREEN, Color.BLUE]);
      done();
    });
  });
  describe('Enum: custom constructor and instance method', () => {
    // Alias, data properties don’t work, because the Enum
    // values (TicTacToe.X etc.) don’t exist when
    // the object literals are evaluated.
    const TicTacToe = Enum.create('TicTacToe', {
      O: {
        get inverse() {
          return (TicTacToe as any).X;
        },
      },
      X: {
        get inverse() {
          return (TicTacToe as any).O;
        },
      },
    });
    it('should support custom instance property', done => {
      expect(TicTacToe.X.inverse).toEqual(TicTacToe.O);
      expect(TicTacToe.O.inverse).toEqual(TicTacToe.X);
      done();
    });
    it('toString', () => {
      expect(String(TicTacToe.O)).toEqual('TicTacToe.O');
    });
    it('valueOf', () => {
      expect(TicTacToe.O.valueOf()).toEqual(0);
      expect(TicTacToe.X.valueOf()).toEqual(1);
    });
  });
  describe('Enum: custom prototype method', () => {
    class Weekday extends Enum {
      static MONDAY;
      static TUESDAY;
      static WEDNESDAY;
      static THURSDAY;
      static FRIDAY;
      static SATURDAY;
      static SUNDAY;
      isBusinessDay() {
        switch (this) {
          case Weekday.SATURDAY:
          case Weekday.SUNDAY:
            return false;
          default:
            return true;
        }
      }
    }
    Weekday.initEnum([
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ]);
    it('Custom prototype method', () => {
      expect(Weekday.SATURDAY.isBusinessDay()).toEqual(false);
      expect(Weekday.MONDAY.isBusinessDay()).toEqual(true);
    });
    it('should support "enumValues"', () => {
      expect(Weekday.enumValues).toEqual([
        Weekday.MONDAY,
        Weekday.TUESDAY,
        Weekday.WEDNESDAY,
        Weekday.THURSDAY,
        Weekday.FRIDAY,
        Weekday.SATURDAY,
        Weekday.SUNDAY,
      ]);
    });
  });
  describe('Enum: flags', () => {
    class Mode extends Enum {
      static USER_R;
      static USER_W;
      static USER_X;
      static GROUP_R;
      static GROUP_W;
      static GROUP_X;
      static ALL_R;
      static ALL_W;
      static ALL_X;
    }
    Mode.initEnum({
      USER_R: 0b100000000,
      USER_W: 0b010000000,
      USER_X: 0b001000000,
      GROUP_R: 0b000100000,
      GROUP_W: 0b000010000,
      GROUP_X: 0b000001000,
      ALL_R: 0b000000100,
      ALL_W: 0b000000010,
      ALL_X: 0b000000001,
    });
    it('Using the flags', () => {
      expect(
        Mode.USER_R |
          Mode.USER_W |
          Mode.USER_X |
          Mode.GROUP_R |
          Mode.GROUP_X |
          Mode.ALL_R |
          Mode.ALL_X
      ).toEqual(0o755);
      expect(Mode.USER_R | Mode.USER_W | Mode.USER_X | Mode.GROUP_R).toEqual(
        0o740
      );
    });
    it('Should be type of Enum and Mode', () => {
      expect(Mode.USER_R).toBeInstanceOf(Enum);
      expect(Mode.USER_R).toBeInstanceOf(Mode);
      expect(Mode.ALL_X).toBeInstanceOf(Enum);
      expect(Mode.ALL_X).toBeInstanceOf(Mode);
    });
  });
});
