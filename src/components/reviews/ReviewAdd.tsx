'use client';

import { Button, Textarea } from '@nextui-org/react';
import { type FormEvent, useRef } from 'react';

type ReviewAddProps = {
  className?: string;
  addReview: (formData: FormData) => void;
  reviewExists: boolean;
};

function ReviewAdd({ className, addReview, reviewExists }: ReviewAddProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    addReview(formData);
  };

  return (
    <>
      {reviewExists && <p>Du har allerede skrevet en anmeldelse</p>}
      {!reviewExists && (
        <form ref={formRef} onSubmit={handleSubmit} className={className}>
          <fieldset className='rate'>
            <input type='radio' id='rating10' name='rating' value='10' />
            <label htmlFor='rating10' title='5 stars'></label>
            <input type='radio' id='rating9' name='rating' value='9' />
            <label
              className='half'
              htmlFor='rating9'
              title='4 1/2 stars'
            ></label>
            <input type='radio' id='rating8' name='rating' value='8' />
            <label htmlFor='rating8' title='4 stars'></label>
            <input type='radio' id='rating7' name='rating' value='7' />
            <label
              className='half'
              htmlFor='rating7'
              title='3 1/2 stars'
            ></label>
            <input type='radio' id='rating6' name='rating' value='6' />
            <label htmlFor='rating6' title='3 stars'></label>
            <input type='radio' id='rating5' name='rating' value='5' />
            <label
              className='half'
              htmlFor='rating5'
              title='2 1/2 stars'
            ></label>
            <input type='radio' id='rating4' name='rating' value='4' />
            <label htmlFor='rating4' title='2 stars'></label>
            <input type='radio' id='rating3' name='rating' value='3' />
            <label
              className='half'
              htmlFor='rating3'
              title='1 1/2 stars'
            ></label>
            <input type='radio' id='rating2' name='rating' value='2' />
            <label htmlFor='rating2' title='1 star'></label>
            <input type='radio' id='rating1' name='rating' value='1' />
            <label className='half' htmlFor='rating1' title='1/2 star'></label>
          </fieldset>
          <Textarea
            label='Kommentar'
            placeholder='Skriv en kommentar...'
            className='max-w-xs'
            name='comment'
          />
          <Button color='primary' type='submit'>
            Submit
          </Button>

          <style jsx>{`
            @import url(//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css);
            .rate {
              display: inline-block;
              border: 0;
            }
            /* Hide radio */
            .rate > input {
              display: none;
            }
            /* Order correctly by floating highest to the right */
            .rate > label {
              float: right;
            }
            /* The star of the show */
            .rate > label:before {
              display: inline-block;
              font-size: 1.1rem;
              padding: 0.3rem 0.2rem;
              margin: 0;
              cursor: pointer;
              font-family: FontAwesome;
              content: '\f005 '; /* full star */
            }
            /* Half star trick */
            .rate .half:before {
              content: '\f089 '; /* half star no outline */
              position: absolute;
              padding-right: 0;
            }
            /* Click + hover color */
            input:checked ~ label, /* color current and previous stars on checked */
    label:hover, label:hover ~ label {
              color: #73b100;
            } /* color previous stars on hover */

            /* Hover highlights */
            input:checked + label:hover, input:checked ~ label:hover, /* highlight current and previous stars */
    input:checked ~ label:hover ~ label, /* highlight previous selected stars for new rating */
    label:hover ~ input:checked ~ label /* highlight previous selected stars */ {
              color: #a6e72d;
            }
          `}</style>
        </form>
      )}
    </>
  );
}

export { ReviewAdd };
