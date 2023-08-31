namespace cadastro_livro
{
    partial class Form1
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.Windows.Forms.ColumnHeader qtd_estoque;
            this.btnSalvar = new System.Windows.Forms.Button();
            this.textBusca = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.textPreC = new System.Windows.Forms.TextBox();
            this.btnBuscar = new System.Windows.Forms.Button();
            this.label6 = new System.Windows.Forms.Label();
            this.textName = new System.Windows.Forms.TextBox();
            this.btnDeletar = new System.Windows.Forms.Button();
            this.listView1 = new System.Windows.Forms.ListView();
            this.id = new System.Windows.Forms.ColumnHeader();
            this.col_name = new System.Windows.Forms.ColumnHeader();
            this.col_categoria = new System.Windows.Forms.ColumnHeader();
            this.col_tamanho = new System.Windows.Forms.ColumnHeader();
            this.col_p_compra = new System.Windows.Forms.ColumnHeader();
            this.col_p_venda = new System.Windows.Forms.ColumnHeader();
            this.col_ativo = new System.Windows.Forms.ColumnHeader();
            this.btnLimpar = new System.Windows.Forms.Button();
            this.comboTam = new System.Windows.Forms.ComboBox();
            this.textId = new System.Windows.Forms.TextBox();
            this.label8 = new System.Windows.Forms.Label();
            this.textPreV = new System.Windows.Forms.TextBox();
            this.comboTipo = new System.Windows.Forms.ComboBox();
            this.buttonFornecedor = new System.Windows.Forms.Button();
            this.buttonComp = new System.Windows.Forms.Button();
            this.buttonBalanco = new System.Windows.Forms.Button();
            this.label7 = new System.Windows.Forms.Label();
            this.buttonCli = new System.Windows.Forms.Button();
            this.btnRegistraVenda = new System.Windows.Forms.Button();
            this.textQtd = new System.Windows.Forms.TextBox();
            this.label9 = new System.Windows.Forms.Label();
            this.comboStatus = new System.Windows.Forms.ComboBox();
            this.checkBoxAtivo = new System.Windows.Forms.CheckBox();
            this.buttonPedidoCompra = new System.Windows.Forms.Button();
            qtd_estoque = new System.Windows.Forms.ColumnHeader();
            this.SuspendLayout();
            // 
            // qtd_estoque
            // 
            qtd_estoque.Text = "Estoque";
            // 
            // btnSalvar
            // 
            this.btnSalvar.FlatStyle = System.Windows.Forms.FlatStyle.System;
            this.btnSalvar.Location = new System.Drawing.Point(415, 203);
            this.btnSalvar.Name = "btnSalvar";
            this.btnSalvar.Size = new System.Drawing.Size(75, 23);
            this.btnSalvar.TabIndex = 0;
            this.btnSalvar.Text = "Salvar";
            this.btnSalvar.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnSalvar.UseVisualStyleBackColor = true;
            this.btnSalvar.Click += new System.EventHandler(this.btnSalvar_Click);
            // 
            // textBusca
            // 
            this.textBusca.Location = new System.Drawing.Point(12, 61);
            this.textBusca.Name = "textBusca";
            this.textBusca.PlaceholderText = "Nome do Produto";
            this.textBusca.Size = new System.Drawing.Size(190, 23);
            this.textBusca.TabIndex = 1;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(12, 43);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(40, 15);
            this.label1.TabIndex = 2;
            this.label1.Text = "Nome";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(610, 43);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(58, 15);
            this.label2.TabIndex = 3;
            this.label2.Text = "Categoria";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(519, 90);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(88, 15);
            this.label3.TabIndex = 5;
            this.label3.Text = "Preço de Venda";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(411, 90);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(99, 15);
            this.label5.TabIndex = 8;
            this.label5.Text = "Preço de Compra";
            // 
            // textPreC
            // 
            this.textPreC.Location = new System.Drawing.Point(411, 108);
            this.textPreC.Name = "textPreC";
            this.textPreC.PlaceholderText = "$compra";
            this.textPreC.Size = new System.Drawing.Size(102, 23);
            this.textPreC.TabIndex = 9;
            // 
            // btnBuscar
            // 
            this.btnBuscar.Location = new System.Drawing.Point(306, 64);
            this.btnBuscar.Name = "btnBuscar";
            this.btnBuscar.Size = new System.Drawing.Size(75, 23);
            this.btnBuscar.TabIndex = 11;
            this.btnBuscar.Text = "Buscar";
            this.btnBuscar.UseVisualStyleBackColor = true;
            this.btnBuscar.Click += new System.EventHandler(this.btnBuscar_Click);
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(411, 43);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(40, 15);
            this.label6.TabIndex = 13;
            this.label6.Text = "Nome";
            // 
            // textName
            // 
            this.textName.Location = new System.Drawing.Point(411, 61);
            this.textName.Name = "textName";
            this.textName.PlaceholderText = "Nome do Produto";
            this.textName.Size = new System.Drawing.Size(193, 23);
            this.textName.TabIndex = 12;
            // 
            // btnDeletar
            // 
            this.btnDeletar.Enabled = false;
            this.btnDeletar.Location = new System.Drawing.Point(415, 247);
            this.btnDeletar.Name = "btnDeletar";
            this.btnDeletar.Size = new System.Drawing.Size(75, 23);
            this.btnDeletar.TabIndex = 15;
            this.btnDeletar.Text = "Delete";
            this.btnDeletar.UseVisualStyleBackColor = true;
            this.btnDeletar.Click += new System.EventHandler(this.btnDeletar_Click);
            // 
            // listView1
            // 
            this.listView1.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.id,
            this.col_name,
            this.col_categoria,
            this.col_tamanho,
            this.col_p_compra,
            this.col_p_venda,
            qtd_estoque,
            this.col_ativo});
            this.listView1.FullRowSelect = true;
            this.listView1.Location = new System.Drawing.Point(12, 90);
            this.listView1.Name = "listView1";
            this.listView1.Size = new System.Drawing.Size(369, 286);
            this.listView1.TabIndex = 16;
            this.listView1.UseCompatibleStateImageBehavior = false;
            this.listView1.View = System.Windows.Forms.View.Details;
            this.listView1.Click += new System.EventHandler(this.listView1_Click);
            // 
            // id
            // 
            this.id.Text = "id";
            this.id.Width = 0;
            // 
            // col_name
            // 
            this.col_name.Text = "Nome";
            this.col_name.Width = 65;
            // 
            // col_categoria
            // 
            this.col_categoria.Text = "Categoria";
            this.col_categoria.Width = 65;
            // 
            // col_tamanho
            // 
            this.col_tamanho.Text = "Tam";
            this.col_tamanho.Width = 50;
            // 
            // col_p_compra
            // 
            this.col_p_compra.Text = "Preço_C";
            // 
            // col_p_venda
            // 
            this.col_p_venda.Text = "Preço_V";
            // 
            // col_ativo
            // 
            this.col_ativo.Text = "Ativo";
            this.col_ativo.Width = 0;
            // 
            // btnLimpar
            // 
            this.btnLimpar.Location = new System.Drawing.Point(415, 292);
            this.btnLimpar.Name = "btnLimpar";
            this.btnLimpar.Size = new System.Drawing.Size(75, 23);
            this.btnLimpar.TabIndex = 19;
            this.btnLimpar.Text = "Limpar";
            this.btnLimpar.UseVisualStyleBackColor = true;
            this.btnLimpar.Click += new System.EventHandler(this.btnLimpar_Click);
            // 
            // comboTam
            // 
            this.comboTam.FormattingEnabled = true;
            this.comboTam.Items.AddRange(new object[] {
            "Unico",
            "255 ml",
            "330 ml",
            "350 ml",
            "475 ml",
            "600 ml",
            "1 litro",
            "1.5 litro",
            "2 litros"});
            this.comboTam.Location = new System.Drawing.Point(613, 108);
            this.comboTam.Name = "comboTam";
            this.comboTam.Size = new System.Drawing.Size(129, 23);
            this.comboTam.TabIndex = 10;
            this.comboTam.Text = "Select";
            // 
            // textId
            // 
            this.textId.Enabled = false;
            this.textId.Location = new System.Drawing.Point(699, 12);
            this.textId.Name = "textId";
            this.textId.PlaceholderText = "Id Programa";
            this.textId.Size = new System.Drawing.Size(40, 23);
            this.textId.TabIndex = 20;
            this.textId.Visible = false;
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(613, 90);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(56, 15);
            this.label8.TabIndex = 24;
            this.label8.Text = "Tamanho";
            // 
            // textPreV
            // 
            this.textPreV.Location = new System.Drawing.Point(519, 107);
            this.textPreV.Name = "textPreV";
            this.textPreV.PlaceholderText = "$venda";
            this.textPreV.Size = new System.Drawing.Size(88, 23);
            this.textPreV.TabIndex = 25;
            // 
            // comboTipo
            // 
            this.comboTipo.FormattingEnabled = true;
            this.comboTipo.Items.AddRange(new object[] {
            "Bebida",
            "Comida",
            "Cigarro",
            "Outros"});
            this.comboTipo.Location = new System.Drawing.Point(610, 61);
            this.comboTipo.Name = "comboTipo";
            this.comboTipo.Size = new System.Drawing.Size(129, 23);
            this.comboTipo.TabIndex = 26;
            this.comboTipo.Text = "Select";
            // 
            // buttonFornecedor
            // 
            this.buttonFornecedor.Location = new System.Drawing.Point(508, 261);
            this.buttonFornecedor.Name = "buttonFornecedor";
            this.buttonFornecedor.Size = new System.Drawing.Size(234, 23);
            this.buttonFornecedor.TabIndex = 27;
            this.buttonFornecedor.Text = "Gerenciar Fornecedor";
            this.buttonFornecedor.UseVisualStyleBackColor = true;
            this.buttonFornecedor.Click += new System.EventHandler(this.buttonFornecedor_Click);
            // 
            // buttonComp
            // 
            this.buttonComp.Location = new System.Drawing.Point(508, 232);
            this.buttonComp.Name = "buttonComp";
            this.buttonComp.Size = new System.Drawing.Size(234, 23);
            this.buttonComp.TabIndex = 28;
            this.buttonComp.Text = "Registrar Compra";
            this.buttonComp.UseVisualStyleBackColor = true;
            this.buttonComp.Click += new System.EventHandler(this.buttonComp_Click);
            // 
            // buttonBalanco
            // 
            this.buttonBalanco.Location = new System.Drawing.Point(415, 353);
            this.buttonBalanco.Name = "buttonBalanco";
            this.buttonBalanco.Size = new System.Drawing.Size(327, 23);
            this.buttonBalanco.TabIndex = 29;
            this.buttonBalanco.Text = "Balanço de Compras e Vendas";
            this.buttonBalanco.UseVisualStyleBackColor = true;
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(411, 135);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(39, 15);
            this.label7.TabIndex = 31;
            this.label7.Text = "Status";
            // 
            // buttonCli
            // 
            this.buttonCli.Location = new System.Drawing.Point(508, 292);
            this.buttonCli.Name = "buttonCli";
            this.buttonCli.Size = new System.Drawing.Size(234, 23);
            this.buttonCli.TabIndex = 32;
            this.buttonCli.Text = "Gerenciar Cliente";
            this.buttonCli.UseVisualStyleBackColor = true;
            this.buttonCli.Click += new System.EventHandler(this.buttonCli_Click);
            // 
            // btnRegistraVenda
            // 
            this.btnRegistraVenda.Location = new System.Drawing.Point(508, 203);
            this.btnRegistraVenda.Name = "btnRegistraVenda";
            this.btnRegistraVenda.Size = new System.Drawing.Size(234, 23);
            this.btnRegistraVenda.TabIndex = 33;
            this.btnRegistraVenda.Text = "Registrar Venda";
            this.btnRegistraVenda.UseVisualStyleBackColor = true;
            this.btnRegistraVenda.Click += new System.EventHandler(this.btnRegistraVenda_Click_1);
            // 
            // textQtd
            // 
            this.textQtd.Location = new System.Drawing.Point(519, 153);
            this.textQtd.Name = "textQtd";
            this.textQtd.PlaceholderText = "Quatidade Estoque";
            this.textQtd.Size = new System.Drawing.Size(88, 23);
            this.textQtd.TabIndex = 34;
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(519, 135);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(49, 15);
            this.label9.TabIndex = 35;
            this.label9.Text = "Estoque";
            // 
            // comboStatus
            // 
            this.comboStatus.FormattingEnabled = true;
            this.comboStatus.Items.AddRange(new object[] {
            "Ativo",
            "Inativo"});
            this.comboStatus.Location = new System.Drawing.Point(411, 153);
            this.comboStatus.Name = "comboStatus";
            this.comboStatus.Size = new System.Drawing.Size(99, 23);
            this.comboStatus.TabIndex = 36;
            this.comboStatus.Text = "Select";
            // 
            // checkBoxAtivo
            // 
            this.checkBoxAtivo.AutoSize = true;
            this.checkBoxAtivo.Location = new System.Drawing.Point(217, 64);
            this.checkBoxAtivo.Name = "checkBoxAtivo";
            this.checkBoxAtivo.Size = new System.Drawing.Size(59, 19);
            this.checkBoxAtivo.TabIndex = 37;
            this.checkBoxAtivo.Text = "Ativos";
            this.checkBoxAtivo.UseVisualStyleBackColor = true;
            // 
            // buttonPedidoCompra
            // 
            this.buttonPedidoCompra.Location = new System.Drawing.Point(415, 324);
            this.buttonPedidoCompra.Name = "buttonPedidoCompra";
            this.buttonPedidoCompra.Size = new System.Drawing.Size(327, 23);
            this.buttonPedidoCompra.TabIndex = 38;
            this.buttonPedidoCompra.Text = "Registrar Pedido de Compra";
            this.buttonPedidoCompra.UseVisualStyleBackColor = true;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.AutoSize = true;
            this.ClientSize = new System.Drawing.Size(761, 388);
            this.Controls.Add(this.buttonPedidoCompra);
            this.Controls.Add(this.checkBoxAtivo);
            this.Controls.Add(this.comboStatus);
            this.Controls.Add(this.label9);
            this.Controls.Add(this.textQtd);
            this.Controls.Add(this.btnRegistraVenda);
            this.Controls.Add(this.buttonCli);
            this.Controls.Add(this.label7);
            this.Controls.Add(this.buttonBalanco);
            this.Controls.Add(this.buttonComp);
            this.Controls.Add(this.buttonFornecedor);
            this.Controls.Add(this.comboTipo);
            this.Controls.Add(this.textPreV);
            this.Controls.Add(this.label8);
            this.Controls.Add(this.textId);
            this.Controls.Add(this.btnLimpar);
            this.Controls.Add(this.listView1);
            this.Controls.Add(this.btnDeletar);
            this.Controls.Add(this.label6);
            this.Controls.Add(this.textName);
            this.Controls.Add(this.btnBuscar);
            this.Controls.Add(this.comboTam);
            this.Controls.Add(this.textPreC);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.textBusca);
            this.Controls.Add(this.btnSalvar);
            this.Name = "Form1";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private Button btnSalvar;
        private TextBox textBusca;
        private Label label1;
        private Label label2;
        private Label label3;
        private Label label5;
        private TextBox textPreC;
        private Button btnBuscar;
        private Label label6;
        private TextBox textName;
        private Button btnDeletar;
        private ListView listView1;
        private ColumnHeader col_name;
        private ColumnHeader col_categoria;
        private ColumnHeader col_tamanho;
        private ColumnHeader col_p_compra;
        private ColumnHeader col_p_venda;
        private Button btnLimpar;
        private ComboBox comboTam;
        private ColumnHeader id;
        private TextBox textId;
        private Label label8;
        private ColumnHeader qtd_estoque;
        private TextBox textPreV;
        private ComboBox comboTipo;
        private Button buttonFornecedor;
        private Button buttonComp;
        private Button buttonBalanco;
        private Label label7;
        private Button buttonCli;
        private Button btnRegistraVenda;
        private TextBox textQtd;
        private Label label9;
        private ComboBox comboStatus;
        private CheckBox checkBoxAtivo;
        private ColumnHeader col_ativo;
        private Button buttonPedidoCompra;
    }
}