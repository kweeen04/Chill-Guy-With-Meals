import Image from 'next/image'
import Link from 'next/link'

import { Blockquote } from '@/components/Blockquote'
import { Border } from '@/components/Border'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'

export default function MealList({ mealPlan }) {
    return (
        <Container className="mt-10">
            {/* <FadeIn>
                <h2 className="font-display text-2xl font-semibold text-neutral-950">
                    Meal Plan
                </h2>
            </FadeIn> */}
            <div className="mt-10 space-y-20 sm:space-y-24 lg:space-y-32">
                {mealPlan?.meals?.map((meal, idx) => (
                    <FadeIn key={idx}>
                        <article>
                            <Border className="grid grid-cols-3 gap-x-8 gap-y-8 pt-16">
                                {/* <div className="col-span-full sm:flex sm:items-center sm:justify-between sm:gap-x-8 lg:col-span-1 lg:block">
                                    <div className="sm:flex sm:items-center sm:gap-x-6 lg:block">
                                        <Image
                                            src={meal.logo}
                                            alt=""
                                            className="h-16 w-16 flex-none"
                                            unoptimized
                                        />
                                        <h3 className="mt-6 text-sm font-semibold text-neutral-950 sm:mt-0 lg:mt-8">
                                            {caseStudy.client}
                                        </h3>
                                    </div>
                                    <div className="mt-1 flex gap-x-4 sm:mt-0 lg:block">
                                        <p className="text-sm tracking-tight text-neutral-950 after:ml-4 after:font-semibold after:text-neutral-300 after:content-['/'] lg:mt-2 lg:after:hidden">
                                            {caseStudy.service}
                                        </p>
                                        <p className="text-sm text-neutral-950 lg:mt-2">
                                            <time dateTime={caseStudy.date}>
                                                {formatDate(caseStudy.date)}
                                            </time>
                                        </p>
                                    </div>
                                </div> */}
                                <div className="col-span-full lg:col-span-2 lg:max-w-2xl">
                                    <p className="font-display text-4xl font-medium text-neutral-950">
                                        {meal.type}
                                    </p>
                                    <div className="mt-6 space-y-6 text-base text-neutral-600">
                                        {meal.name}
                                    </div>
                                    <div className="mt-8 flex gap-x-2">
                                        <Button
                                            href={meal.href}
                                            aria-label={`Read case study: ${meal.client}`}
                                        >
                                            Calories: {meal.calories}
                                        </Button>
                                        <Button
                                            href={meal.href}
                                            aria-label={`Read case study: ${meal.client}`}
                                        >
                                            Macros: {meal.macros.protein}g P / {meal.macros.carbs}g C /{' '}
                                            {meal.macros.fat}g F
                                        </Button>
                                    </div>
                                    {meal.testimonial && (
                                        <Blockquote
                                            author={meal.testimonial.author}
                                            className="mt-12"
                                        >
                                            {meal.testimonial.content}
                                        </Blockquote>
                                    )}
                                    {meal.imageUrl && (
                                        <img
                                            src={meal.imageUrl}
                                            alt={meal.name}
                                            className="mt-2 w-full max-w-sm rounded"
                                        />
                                    )}
                                </div>
                            </Border>
                        </article>
                    </FadeIn>
                ))}
            </div>
        </Container>
    )
}