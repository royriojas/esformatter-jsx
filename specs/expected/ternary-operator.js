function demo(containersGroup, isCollections, trans) {
  if ( containersGroup.length === 0 ) {
    containersGroup = isCollections ? <li className="empty-result">
                                        {trans('addToContainer.NO_COLLECTIONS_FOUND')}
                                      </li> : <li className="empty-result">
                                                {trans('addToContainer.NO_CLASSES_FOUND')}
                                              </li>;
  }

  return containersGroup;
}