import { Knex } from 'knex'

export async function up(knex: Knex) {
	return knex.schema.createTable('invites', table => {
		table.increments('id').primary().unique()
		table.string('secret_key').notNullable()
		table.string('invite_link').notNullable().unique()
		table.dateTime('created_at').notNullable()

	  table.integer('tipster_id')
			.notNullable()
			.references('id')
			.inTable('tipsters')
	})
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('invites')
}
