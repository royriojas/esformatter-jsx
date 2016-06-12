@decorator({
  some: 'value',
})
export default class Example {
  var1;
  @readonly
  variable=2;

  @readonly(true)
  variable3   = 3;

  @someDecotator var2;
static v;
static v = { a, b, c};

}
