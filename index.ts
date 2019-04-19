
import { map, debounceTime, distinctUntilChanged, filter, concatMap, startWith } from 'rxjs/operators';
import { of, fromEvent, from, combineLatest } from 'rxjs';

const input = document.querySelector('.my-input');
const select = document.querySelector('.my-select');

combineLatest(
  fromEvent(input, 'input')
    .pipe(
      debounceTime(300),
      map(event => (<HTMLInputElement>event.target).value),
      filter(value => !!value),
      distinctUntilChanged()
    ),
  fromEvent(select, 'input')
    .pipe(
      map(event => (<HTMLSelectElement>event.target).value),
      startWith('stars')
    ),
)
  .pipe(
    concatMap(([value, sortby]) => {
      return from(
        fetch(`https://api.github.com/search/repositories?q=${value}&sort=${sortby}`)
          .then(response => response.json())
      );
    })
  )
  .subscribe(event => console.log(event));

const source = of('World').pipe(
  map(x => `Hello ${x}!`)
);

source.subscribe(x => console.log(x));
