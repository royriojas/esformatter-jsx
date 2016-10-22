function demo(someText) {
  return (
    <div className='.classA' data-attr1='stuff' data-attr2='things'>
      <span className='.classB' data-attr3='attr3'/>
      <div className='.classC' data-attr4='attr4' data-attr5='attr5'>{someText}</div>
    </div>
    );
}