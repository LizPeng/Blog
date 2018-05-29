// rn0.55 ios和android
// flatlist 的getitelayout的scrolltoIndex问题

// 使用自定义的CustomFlatList，
class CustomVirtualizedList extends VirtualizedList {
    constructor(props, context) {
        super(props, context);
        this._fillRateHelper._enabled = true;
    }
}
class CustomFlatList extends FlatList {
    render() {
      return (
        <CustomVirtualizedList
          {...this.props}
          renderItem={this._renderItem}
          getItem={this._getItem}
          getItemCount={this._getItemCount}
          keyExtractor={this._keyExtractor}
          ref={this._captureRef}
          viewabilityConfigCallbackPairs={this._virtualizedListPairs}
        />
      )
    }
}

// 在didUptate调用如下  ，didMount可以不调用
let wait = new Promise((resolve) => setTimeout(resolve, 500));  // Smaller number should work
wait.then( () => {
    this._scrollFlat.scrollToIndex({index: index, animated: true});
});