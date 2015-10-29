const some2 = {};
const from = {};

export /* from */ { some2, from };

export /*from*/ const some = 1;
export /* from */ { abc, bcd }
/* from */ from /* from */ 'some-file'; /* from */ // some comment from john

export /* from */ edfg
/* from */ from /* from */ 'some-file'; /* from */ // some comment from john

export * as some from 'here';

export class myClass {
  execute() {
    //comment from me
  }
}
